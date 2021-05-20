import { copyMatchingKeyValues, colorFromHexToGlRgb } from './utils'
import SHADER_CODE_VERT_TMPL from './shader-code-vert-tmpl'
import SHADER_CODE_FRAG_TMPL from './shader-code-frag-tmpl'
import SPlotContol from './splot-control'
import SPlotWebGl from './splot-webgl'
import SPlotDebug from './splot-debug'
import SPlotDemo from './splot-demo'

export default class SPlot {

  /** Функция итерирования исходных данных. */
  public iterator: SPlotIterator = undefined

  /** Хелпер режима демо-данных. */
  public demo: SPlotDemo = new SPlotDemo(this)

  /** Хелпер режима отладки. */
  public debug: SPlotDebug = new SPlotDebug()

  /** Хелпер WebGL. */
  public webgl: SPlotWebGl = new SPlotWebGl()

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

  /** Шаблоны GLSL-кодов для шейдеров. */
  protected shaderCodeVert: string = SHADER_CODE_VERT_TMPL
  protected shaderCodeFrag: string = SHADER_CODE_FRAG_TMPL

  /** Хелпер взаимодействия с устройством ввода. */
  protected control: SPlotContol = new SPlotContol()

  /** Статистическая информация. */
  public stats = {
    objectsCountTotal: 0,
    objectsCountInGroups: [] as number[],
    groupsCount: 0,
    memUsage: 0
  }

  /**
   * Создает экземпляр класса, инициализирует настройки.
   *
   * @remarks
   * Если канвас с заданным идентификатором не найден - генерируется ошибка. Настройки могут быть заданы как в
   * конструкторе, так и в методе {@link setup}. Однако в любом случае настройки должны быть заданы до запуска рендера.
   *
   * @param canvasId - Идентификатор канваса, на котором будет рисоваться график.
   * @param options - Пользовательские настройки экземпляра.
   */
  constructor(canvasId: string, options?: SPlotOptions) {

    this.webgl.prepare(canvasId)
    this.control.prepare(this)

    if (options) {
      this.setOptions(options)    // Если переданы настройки, то они применяются.

      if (this.forceRun) {
        this.setup(options)       //  Инициализация всех параметров рендера, если запрошен форсированный запуск.
      }
    }
  }

  /**
   * Инициализирует необходимые для рендера параметры экземпляра и WebGL.
   *
   * @param options - Пользовательские настройки экземпляра.
   */
  public setup(options: SPlotOptions): void {

    this.setOptions(options)    // Применение пользовательских настроек.
    this.webgl.create()         // Создание контекста рендеринга.
    this.demo.prepare()

    if (this.debug.isEnable) {
      this.debug.logIntro(this, this.webgl.canvas)
      this.debug.logGpuInfo(this.webgl.gpu.hardware, this.webgl.gpu.software)
      this.debug.logInstanceInfo(this, this.webgl.canvas, options)
    }

    this.webgl.setBgColor(this.grid.bgColor!)    // Установка цвета очистки рендеринга

    // Создание шейдеров WebGL.
    const shaderCodeVert = this.shaderCodeVert.replace('{EXT-CODE}', this.genShaderColorCode())
    const shaderCodeFrag = this.shaderCodeFrag

    this.webgl.createProgram(shaderCodeVert, shaderCodeFrag)    // Создание программы WebGL.

    if (this.debug.isEnable) {
      this.debug.logShaderInfo('VERTEX_SHADER', shaderCodeVert)
      this.debug.logShaderInfo('FRAGMENT_SHADER', shaderCodeFrag)
    }

    // Создание переменных WebGl.
    this.webgl.createVariables('a_position', 'a_color', 'a_size', 'a_shape', 'u_matrix')

    this.loadData()    // Заполнение буферов WebGL.

    if (this.forceRun) {
      this.run()                // Форсированный запуск рендеринга (если требуется).
    }
  }

  /**
   * Применяет пользовательские настройки экземпляра.
   *
   * @param options - Пользовательские настройки экземпляра.
   */
  protected setOptions(options: SPlotOptions): void {

    copyMatchingKeyValues(this, options)    // Применение пользовательских настроек.

    // Если задан размер плоскости, но не задано положение области просмотра, то область помещается в центр плоскости.
    if (('grid' in options) && !('camera' in options)) {
      this.camera.x = this.grid.width! / 2
      this.camera.y = this.grid.height! / 2
    }

    if (this.demo.isEnable) {
      this.iterator = this.demo.iterator.bind(this.demo)    // Имитация итерирования для демо-режима.
      this.colors = this.demo.colors
    }
  }

  /**
   * Создает и заполняет данными обо всех полигонах буферы WebGL.
   */

  protected loadData(): void {

    if (this.debug.isEnable) {
      this.debug.logDataLoadingStart()
    }

    let polygonGroup: SPlotPolygonGroup = { vertices: [], colors: [], sizes: [], shapes: [], amountOfVertices: 0 }

    this.stats = {
      objectsCountTotal: 0,
      objectsCountInGroups: [] as number[],
      groupsCount: 0,
      memUsage: 0
    }

    let object: SPlotObject | null | undefined
    let k: number = 0
    let isObjectEnds: boolean = false

    while (!isObjectEnds) {

      object = this.iterator!()
      isObjectEnds = (object === null) || (this.stats.objectsCountTotal >= this.globalLimit)

      if (!isObjectEnds) {
        polygonGroup.vertices.push(object!.x, object!.y)
        polygonGroup.shapes.push(object!.shape)
        polygonGroup.sizes.push(object!.size)
        polygonGroup.colors.push(object!.color)
        k++
        this.stats.objectsCountTotal++
      }

      if ((k >= this.groupLimit) || isObjectEnds) {
        this.stats.objectsCountInGroups[this.stats.groupsCount] = k

        /** Создание и заполнение буферов данными о текущей группе полигонов. */
        this.stats.memUsage +=
          this.webgl.createBuffer('vertices', new Float32Array(polygonGroup.vertices)) +
          this.webgl.createBuffer('colors', new Uint8Array(polygonGroup.colors)) +
          this.webgl.createBuffer('shapes', new Uint8Array(polygonGroup.shapes)) +
          this.webgl.createBuffer('sizes', new Float32Array(polygonGroup.sizes))
      }

      if ((k >= this.groupLimit) && !isObjectEnds) {
        this.stats.groupsCount++
        polygonGroup = { vertices: [], colors: [], sizes: [], shapes: [], amountOfVertices: 0 }
        k = 0
      }
    }

    if (this.debug.isEnable) {
      this.debug.logDataLoadingComplete(this.stats.objectsCountTotal, this.globalLimit)
      this.debug.logGpuMemStats(this.stats)
    }
  }

  /**
   * Создает дополнение к коду на языке GLSL.
   *
   * @remarks
   * В дальнейшем созданный код будет встроен в код вершинного шейдера для задания цвета вершины в зависимости от
   * индекса цвета, присвоенного этой вершине. Т.к. шейдер не позволяет использовать в качестве индексов переменные -
   * для задания цвета используется перебор цветовых индексов.
   *
   * @returns Код на языке GLSL.
   */
  protected genShaderColorCode(): string {

    // Временное добавление в палитру цветов вершин цвета направляющих.
    this.colors.push(this.grid.rulesColor!)

    let code: string = ''

    for (let i = 0; i < this.colors.length; i++) {

      // Получение цвета в нужном формате.
      let [r, g, b] = colorFromHexToGlRgb(this.colors[i])

      // Формировние строк GLSL-кода проверки индекса цвета.
      code += ((i === 0) ? '' : '  else ') + 'if (a_color == ' + i + '.0) v_color = vec3(' +
        r.toString().slice(0, 9) + ',' +
        g.toString().slice(0, 9) + ',' +
        b.toString().slice(0, 9) + ');\n'
    }

    // Удаление из палитры вершин временно добавленного цвета направляющих.
    this.colors.pop()

    return code
  }

  /**
   * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
   */
  public render(): void {

    // Очистка объекта рендеринга WebGL.
    this.webgl.clearBackground()

    // Обновление матрицы трансформации.
    this.control.updateViewProjection()

    // Привязка матрицы трансформации к переменной шейдера.
    this.webgl.setVariable('u_matrix', this.control.transform.viewProjectionMat)

    // Итерирование и рендеринг групп буферов WebGL.
    for (let i = 0; i < this.stats.groupsCount; i++) {

      this.webgl.setBuffer('vertices', i, 'a_position', 2, 0, 0)
      this.webgl.setBuffer('colors', i, 'a_color', 1, 0, 0)
      this.webgl.setBuffer('sizes', i, 'a_size', 1, 0, 0)
      this.webgl.setBuffer('shapes', i, 'a_shape', 1, 0, 0)

      this.webgl.drawPoints(0, this.stats.objectsCountInGroups[i])
    }
  }

  /**
   * Запускает рендеринг и контроль управления.
   */
  public run(): void {

    if (this.isRunning) {
      return
    }

    this.render()
    this.control.run()
    this.isRunning = true

    if (this.debug.isEnable) {
      this.debug.logRenderStarted()
    }
  }

  /**
   * Останавливает рендеринг и контроль управления.
   */
  public stop(): void {

    if (!this.isRunning) {
      return
    }

    this.control.stop()
    this.isRunning = false

    if (this.debug.isEnable) {
      this.debug.logRenderStoped()
    }
  }

  /**
   * Очищает фон.
   */
  public clear(): void {

    this.webgl.clearBackground()

    if (this.debug.isEnable) {
      this.debug.logCanvasCleared(this.grid.bgColor!)
    }
  }
}
