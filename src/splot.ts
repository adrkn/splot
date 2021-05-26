import { copyMatchingKeyValues } from '@/utils'
import SPlotContol from '@/splot-control'
import SPlotWebGl from '@/splot-webgl'
import SPlotDebug from '@/splot-debug'
import SPlotDemo from '@/splot-demo'
import SPlotGlsl from '@/splot-glsl'

/** ****************************************************************************
 *
 * Класс SPlot - реализует график типа скаттерплот средствами WebGL.
 */
export default class SPlot {

  /** Функция итерирования исходных данных. */
  public iterator: SPlotIterator = undefined

  /** Хелпер режима отладки. */
  public debug: SPlotDebug = new SPlotDebug(this)

  /** Хелпер, управляющий GLSL-кодом шейдеров. */
  public glsl: SPlotGlsl = new SPlotGlsl(this)

  /** Хелпер WebGL. */
  public webgl: SPlotWebGl = new SPlotWebGl(this)

  /** Хелпер режима демо-данных. */
  public demo: SPlotDemo = new SPlotDemo(this)

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

  /** Признак необходимости загрузки данных об объектах. */
  public loadData: boolean = true

  /** Признак необходимости безотлагательного запуска рендера. */
  public isRunning: boolean = false

  /** Количество различных форм объектов. Вычисляется позже в хелпере glsl. */
  public shapesCount: number | undefined

  /** Статистическая информация. */
  public stats = {
    objTotalCount: 0,
    objInGroupCount: [] as number[],
    groupsCount: 0,
    memUsage: 0
  }

  /** Объект-канвас контекста рендеринга WebGL. */
  public canvas: HTMLCanvasElement

  /** Настройки, запрошенные пользователем в конструкторе или при последнем вызове setup. */
  public lastRequestedOptions: SPlotOptions | undefined = {}

  /** Хелпер взаимодействия с устройством ввода. */
  protected control: SPlotContol = new SPlotContol(this)

  /** Признак того, что экземпляр класса был корректно подготовлен к рендеру. */
  private isSetuped: boolean = false

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

      /** Если переданы пользовательские настройки, то они применяются. */
      copyMatchingKeyValues(this, options)
      this.lastRequestedOptions = options

      /** Инициализация всех параметров рендера, если запрошен форсированный запуск. */
      if (this.forceRun) {
        this.setup(options)
      }
    }
  }

  /** ****************************************************************************
   *
   * Инициализирует необходимые для рендера параметры экземпляра, выполняет подготовку и заполнение буферов WebGL.
   *
   * @param options - Настройки экземпляра.
   */
  public setup(options?: SPlotOptions): void {

    if (!options) options = {}

    /** Применение пользовательских настроек. */
    copyMatchingKeyValues(this, options)
    this.lastRequestedOptions = options

    this.debug.log('intro')

    /** Подготовка всех хелперов. Последовательность подготовки имеет значение. */
    this.debug.setup()
    this.glsl.setup()
    this.webgl.setup()
    this.control.setup()
    this.demo.setup()

    this.debug.log('instance')

    /** Обработка всех данных об объектах и их загрузка в буферы видеопамяти. */
    if (this.loadData) {
      this.load()

      /** По умолчанию при повторном вызове метода setup новое чтение объектов не производится. */
      this.loadData = false
    }

    /** Действия, которые выполняются только при первом вызове метода setup. */
    if (!this.isSetuped) {

      /** Создание переменных WebGl. */
      this.webgl.createVariables('a_position', 'a_color', 'a_size', 'a_shape', 'u_matrix')

      /** Признак того, что экземпляр как минимум один раз выполнил метод setup. */
      this.isSetuped = true
    }

    /** Проверка корректности настройки экземпляра. */
    this.checkSetup()

    if (this.forceRun) {
      /** Форсированный запуск рендеринга (если требуется). */
      this.run()
    }
  }

  /** ****************************************************************************
   *
   * Создает и заполняет данными обо всех объектах буферы WebGL.
   */
  protected load(): void {

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
   * Проверяет корректность настроек экземпляра.
   *
   * @remarks
   * Используется для проверки корректности логики работы пользователя с экземпляром. Не позволяет работать с
   * ненастроенным или некорректно настроенным экземпляром.
   */
  checkSetup() {

    /**
     *  Пользователь мог настроить экземпляр в конструкторе и сразу запустить рендер, в таком случае метод setup
     *  будет вызывается неявно.
     */
    if (!this.isSetuped) {
      this.setup()
    }

    /** Набор проверок корректности настройки экземпляра. */
    if (!this.iterator) {
      throw new Error('Не задана функция итерирования объектов!')
    }
  }

  /** ****************************************************************************
   *
   * Запускает рендеринг и контроль управления.
   */
  public run(): void {

    this.checkSetup()

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

    this.checkSetup()

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

    this.checkSetup()

    this.webgl.clearBackground()
    this.debug.log('cleared')
  }
}
