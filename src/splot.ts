import { copyMatchingKeyValues, colorFromHexToGlRgb } from './utils'
import SHADER_CODE_VERT_TMPL from './shader-code-vert-tmpl'
import SHADER_CODE_FRAG_TMPL from './shader-code-frag-tmpl'
import SPlotContol from './splot-control'
import SPlotWebGl from './splot-webgl'
import SPlotDebug from './splot-debug'
import SPlotDemo from './splot-demo'

/** ****************************************************************************
 *
 * Класс SPlot - реализует график типа скаттерплот средствами WebGL.
 */
export default class SPlot {

  /** Функция итерирования исходных данных. */
  public iterator: SPlotIterator = undefined

  /** Хелпер WebGL. */
  public webgl: SPlotWebGl = new SPlotWebGl(this)

  /** Хелпер режима демо-данных. */
  public demo: SPlotDemo = new SPlotDemo(this)

  /** Хелпер режима отладки. */
  public debug: SPlotDebug = new SPlotDebug(this)

  /** Признак форсированного запуска рендера. */
  public forceRun: boolean = false

  /** Ограничение кол-ва объектов на графике. */
  public globalLimit: number = 1_000_000_000

  /** Ограничение кол-ва объектов в группе. */
  public groupLimit: number = 10_000

  /** Цветовая палитра объектов. */
  public colors: string[] = []

  /** Параметры координатной плоскости. */
  public grid: SPlotGrid = {
    width: 32_000,
    height: 16_000,
    bgColor: '#ffffff',
    rulesColor: '#c0c0c0'
  }

  /** Параметры области просмотра. */
  public camera: SPlotCamera = {
    x: this.grid.width! / 2,
    y: this.grid.height! / 2,
    zoom: 1
  }

  /** Признак необходимости безотлагательного запуска рендера. */
  public isRunning: boolean = false

  /** Количество различных форм объектов. */
  public shapesCount: number = 2

  /** GLSL-коды шейдеров. */
  public shaderCodeVert: string = ''
  public shaderCodeFrag: string = ''

  /** Статистическая информация. */
  public stats = {
    objTotalCount: 0,
    objInGroupCount: [] as number[],
    groupsCount: 0,
    memUsage: 0
  }

  /** Объект-канвас контекста рендеринга WebGL. */
  public canvas: HTMLCanvasElement

  /** Хелпер взаимодействия с устройством ввода. */
  protected control: SPlotContol = new SPlotContol(this)

  /** ****************************************************************************
   *
   * Создает экземпляр класса, инициализирует настройки (если переданы).
   *
   * @remarks
   * Если канвас с заданным идентификатором не найден - генерируется ошибка. Настройки могут быть заданы как в
   * конструкторе, так и в методе {@link setup}. В любом случае настройки должны быть заданы до запуска рендера.
   *
   * @param canvasId - Идентификатор канваса, на котором будет рисоваться график.
   * @param options - Пользовательские настройки экземпляра.
   */
  constructor(canvasId: string, options?: SPlotOptions) {

    if (document.getElementById(canvasId)) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    } else {
      throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!')
    }

    if (options) {
      this.setOptions(options)    // Если переданы настройки, то они применяются.

      if (this.forceRun) {
        this.setup(options)       //  Инициализация всех параметров рендера, если запрошен форсированный запуск.
      }
    }
  }

  /** ****************************************************************************
   *
   * Инициализирует необходимые для рендера параметры экземпляра, выполняет подготовку и заполнение буферов WebGL.
   *
   * @param options - Настройки экземпляра.
   */
  public setup(options: SPlotOptions): void {

    /** Применение пользовательских настроек. */
    this.setOptions(options)

    this.debug.log('intro')

    /** Подготовка всех хелперов. */
    this.webgl.setup()
    this.control.setup()
    this.debug.setup()
    this.demo.setup()

    this.debug.log('instance')

    /** Установка фонового цвета канваса (цвет очистки контекста рендеринга). */
    this.webgl.setBgColor(this.grid.bgColor!)

    /** Создание шейдеров и программы WebGL. */
    this.shaderCodeVert = SHADER_CODE_VERT_TMPL.replace('{EXT-CODE}', this.genShaderColorCode()).trim()
    this.shaderCodeFrag = SHADER_CODE_FRAG_TMPL.trim()
    this.webgl.createProgram(this.shaderCodeVert, this.shaderCodeFrag)

    /** Создание переменных WebGl. */
    this.webgl.createVariables('a_position', 'a_color', 'a_size', 'a_shape', 'u_matrix')

    /** Обработка всех данных об объектах и их загрузка в буферы видеопамяти. */
    this.loadData()

    if (this.forceRun) {
      /** Форсированный запуск рендеринга (если требуется). */
      this.run()
    }
  }

  /** ****************************************************************************
   *
   * Применяет настройки экземпляра.
   *
   * @param options - Настройки экземпляра.
   */
  protected setOptions(options: SPlotOptions): void {

    /** Применение пользовательских настроек. */
    copyMatchingKeyValues(this, options)

    /** Если задан размер плоскости, но не задано положение области просмотра, то она помещается в центр плоскости. */
    if (('grid' in options) && !('camera' in options)) {
      this.camera.x = this.grid.width! / 2
      this.camera.y = this.grid.height! / 2
    }

    if (this.demo.isEnable) {

      /** Подготовка демо-режима (если требуется). */
      this.iterator = this.demo.iterator.bind(this.demo)
      this.colors = this.demo.colors
    }
  }

  /** ****************************************************************************
   *
   * Создает и заполняет данными обо всех объектах буферы WebGL.
   */
  protected loadData(): void {

    this.debug.log('loading')

    let groups = { vertices: [] as number[], colors: [] as number[], sizes: [] as number[], shapes: [] as number[] }
    this.stats = { objTotalCount: 0, objInGroupCount: [] as number[], groupsCount: 0, memUsage: 0 }

    let object: SPlotObject | null | undefined
    let i: number = 0
    let isObjectEnds: boolean = false

    while (!isObjectEnds) {

      object = this.iterator!()
      isObjectEnds = (object === null) || (this.stats.objTotalCount >= this.globalLimit)

      if (!isObjectEnds) {
        groups.vertices.push(object!.x, object!.y)
        groups.shapes.push(object!.shape)
        groups.sizes.push(object!.size)
        groups.colors.push(object!.color)
        this.stats.objTotalCount++
        i++
      }

      if ((i >= this.groupLimit) || isObjectEnds) {
        this.stats.objInGroupCount[this.stats.groupsCount] = i

        /** Создание и заполнение буферов данными о текущей группе объектов. */
        this.stats.memUsage +=
          this.webgl.createBuffer('vertices', new Float32Array(groups.vertices)) +
          this.webgl.createBuffer('colors', new Uint8Array(groups.colors)) +
          this.webgl.createBuffer('shapes', new Uint8Array(groups.shapes)) +
          this.webgl.createBuffer('sizes', new Float32Array(groups.sizes))
      }

      if ((i >= this.groupLimit) && !isObjectEnds) {
        this.stats.groupsCount++
        groups = { vertices: [], colors: [], sizes: [], shapes: [] }
        i = 0
      }
    }

    this.debug.log('loaded')
  }

  /** ****************************************************************************
   *
   * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
   */
  public render(): void {

    /** Очистка объекта рендеринга WebGL. */
    this.webgl.clearBackground()

    /** Обновление матрицы трансформации. */
    this.control.updateViewProjection()

    /** Привязка матрицы трансформации к переменной шейдера. */
    this.webgl.setVariable('u_matrix', this.control.transform.viewProjectionMat)

    /** Итерирование и рендеринг групп буферов WebGL. */
    for (let i = 0; i < this.stats.groupsCount; i++) {

      this.webgl.setBuffer('vertices', i, 'a_position', 2, 0, 0)
      this.webgl.setBuffer('colors', i, 'a_color', 1, 0, 0)
      this.webgl.setBuffer('sizes', i, 'a_size', 1, 0, 0)
      this.webgl.setBuffer('shapes', i, 'a_shape', 1, 0, 0)

      this.webgl.drawPoints(0, this.stats.objInGroupCount[i])
    }
  }

  /** ****************************************************************************
   *
   * Запускает рендеринг и контроль управления.
   */
  public run(): void {
    if (!this.isRunning) {
      this.render()
      this.control.run()
      this.isRunning = true
      this.debug.log('started')
    }
  }

  /** ****************************************************************************
   *
   * Останавливает рендеринг и контроль управления.
   */
  public stop(): void {
    if (this.isRunning) {
      this.control.stop()
      this.isRunning = false
      this.debug.log('stoped')
    }
  }

  /** ****************************************************************************
   *
   * Очищает фон.
   */
  public clear(): void {
    this.webgl.clearBackground()
    this.debug.log('cleared')
  }

  /** ****************************************************************************
   *
   * Создает дополнение к коду на языке GLSL.
   *
   * @remarks
   * Т.к. шейдер не позволяет использовать в качестве индексов переменные - для задания цвета используется
   * посоедовательный перебор цветовых индексов.
   *
   * @returns Код на языке GLSL.
   */
  protected genShaderColorCode(): string {

    /** Временное добавление в палитру вершин цвета направляющих. */
    this.colors.push(this.grid.rulesColor!)

    let code: string = ''

    /** Формировние GLSL-кода установки цвета по индексу. */
    this.colors.forEach((value, index) => {
      let [r, g, b] = colorFromHexToGlRgb(value)
      code += `else if (a_color == ${index}.0) v_color = vec3(${r}, ${g}, ${b});\n`
    })

    /** Удаление из палитры вершин временно добавленного цвета направляющих. */
    this.colors.pop()

    /** Удаление лишнего "else" в начале GLSL-кода. */
    return code.slice(5)
  }
}
