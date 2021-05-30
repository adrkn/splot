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

  /** Данные об объектах графика. */
  public data: SPlotObject[] | undefined = undefined

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
    bgColor: '#ffffff',
    rulesColor: '#c0c0c0'
  }

  /** Параметры области просмотра. */
  public camera: SPlotCamera = {
    x: 0,
    y: 0,
    zoom: 1,
    minZoom: 1,
    maxZoom: 10_000_000
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
    groupsCount: 0,
    memUsage: 0,
    minObjectSize: 1_000_000,
    maxObjectSize: 0,
  }

  /** Объект-канвас контекста рендеринга WebGL. */
  public canvas: HTMLCanvasElement

  /** Настройки, запрошенные пользователем в конструкторе или при последнем вызове setup. */
  public lastRequestedOptions: SPlotOptions | undefined = {}

  /** Хелпер взаимодействия с устройством ввода. */
  protected control: SPlotContol = new SPlotContol(this)

  /** Признак того, что экземпляр класса был корректно подготовлен к рендеру. */
  private isSetuped: boolean = false

  /** Переменная для перебора индексов массива данных data. */
  private arrayIndex: number = 0

  public area = {
    groups: [] as any[],
    step: 0,
    count: 0,
    dxVisibleFrom: 0,
    dxVisibleTo: 0,
    dyVisibleFrom: 0,
    dyVisibleTo: 0,
  }

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

    if (options.data) {
      this.iterator = this.arrayIterator
      this.arrayIndex = 0
    }

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

    this.camera.zoom = Math.min(this.canvas.width, this.canvas.height) - this.stats.maxObjectSize
    this.camera.x = 0.5 - this.canvas.width / (2 * this.camera.zoom)
    this.camera.y = 0.5

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

    this.stats = { objTotalCount: 0, groupsCount: 0, memUsage: 0, minObjectSize: 1_000_000, maxObjectSize: 0 }

    let dx, dy = 0
    let object: SPlotObject | null
    let isObjectEnds: boolean = false

    this.area.step = 0.02
    this.area.count = Math.trunc(1 / this.area.step) + 1

    let groups: any[] = []

    for (let dx = 0; dx < this.area.count; dx++) {
      groups[dx] = []
      for (let dy = 0; dy < this.area.count; dy++) {
        groups[dx][dy] = []
        for (let i = 0; i < 4; i++) { groups[dx][dy][i] = [] }
      }
    }

    while (!isObjectEnds) {

      object = this.iterator!()

      /** Объекты закончились, если итератор вернул null или если достигнут лимит числа объектов. */
      isObjectEnds = (object === null) || (this.stats.objTotalCount >= this.globalLimit)

      if (!isObjectEnds) {

        object = this.checkObject(object!)

        dx = Math.trunc(object.x / this.area.step)
        dy = Math.trunc(object.y / this.area.step)

        groups[dx][dy][0].push(object.x, object.y)
        groups[dx][dy][1].push(object.shape)
        groups[dx][dy][2].push(object.color)
        groups[dx][dy][3].push(object.size)

        if (object.size > this.stats.maxObjectSize) {
          this.stats.maxObjectSize = object.size
        }

        if (object.size < this.stats.minObjectSize) {
          this.stats.minObjectSize = object.size
        }

        this.stats.objTotalCount++
      }
    }

    this.area.groups = groups

    this.webgl.clearData()

    /** Итерирование и занесение данных в буферы WebGL. */
    for (let dx = 0; dx < this.area.count; dx++) {
      for (let dy = 0; dy < this.area.count; dy++) {
        if (groups[dx][dy][1].length > 0) {
          this.stats.memUsage +=
            this.webgl.createBuffer(dx, dy, 0, new Float32Array(groups[dx][dy][0])) +
            this.webgl.createBuffer(dx, dy, 1, new Uint8Array(groups[dx][dy][1])) +
            this.webgl.createBuffer(dx, dy, 2, new Uint8Array(groups[dx][dy][2])) +
            this.webgl.createBuffer(dx, dy, 3, new Uint8Array(groups[dx][dy][3]))

          this.stats.groupsCount += 4
        }
      }
    }

    this.debug.log('loaded')
  }

  /** ****************************************************************************
   *
   * Проверяет корректность параметров объекта и в случае необходимости вносит в них изменения.
   */
  checkObject(object: SPlotObject): SPlotObject {

    /** Проверка корректности расположения объекта. */
    if (object.x > 1) {
      object.x = 1
    } else if (object.x < 0) {
      object.x = 0
    }

    if (object.y > 1) {
      object.y = 1
    } else if (object.y < 0) {
      object.y = 0
    }

    /** Проверка корректности формы и цвета объекта объекта. */
    if ((object.shape >= this.shapesCount!) || (object.shape < 0)) object.shape = 0
    if ((object.color >= this.colors.length) || (object.color < 0)) object.color = 0

    return object
  }

  updateVisibleArea() {
    const kx = this.canvas.width / (2 * this.camera.zoom!)
    const ky = this.canvas.height / (2 * this.camera.zoom!)
    const cameraLeft = this.camera.x!
    const cameraRight = this.camera.x! + 2*kx
    const cameraTop = this.camera.y! - ky
    const cameraBottom = this.camera.y! + ky

    if ( (cameraLeft < 1) && (cameraRight > 0) && (cameraTop < 1) && (cameraBottom > 0) ) {
      this.area.dxVisibleFrom = (cameraLeft < 0) ? 0 : Math.trunc(cameraLeft / this.area.step)
      this.area.dxVisibleTo = (cameraRight > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraRight) / this.area.step)
      this.area.dyVisibleFrom = (cameraTop < 0) ? 0 : Math.trunc(cameraTop / this.area.step)
      this.area.dyVisibleTo = (cameraBottom > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraBottom) / this.area.step)

    } else {
      this.area.dxVisibleFrom = 1
      this.area.dxVisibleTo = 0
      this.area.dyVisibleFrom = 1
      this.area.dyVisibleTo = 0
    }
  }

  getVisibleObjectsParams(totalCount: number, ratio: number): number[] {

    let first: number = 0
    let count: number = 0

    // TODO: Изменить алгоритм расчета отображаемых в группе объектов. Возможно ориентироваться на количество объектов
    // на единицу площади группы.
    if (ratio > 0.1) {
      count = 20 / ratio
    } else if (ratio > 0.05) {
      count = 40 / ratio
    } else if (ratio > 0.03) {
      count = (totalCount - 40 / ratio) * (1 - 2 * ratio) + 40 / ratio
    } else {
      count = totalCount
    }

    count = Math.max(2, Math.min(totalCount, Math.trunc(count)))

    first = totalCount - count

    return [first, count]
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

    this.updateVisibleArea()

    const ratioObjectGroup = this.stats.minObjectSize / (this.camera.zoom! * this.area.step) // !!! max -> min
    let first: number = 0
    let count: number = 0

    //let zz = 0
    /** Итерирование и рендеринг групп буферов WebGL. */
    for (let dx = this.area.dxVisibleFrom; dx < this.area.dxVisibleTo; dx++) {
      for (let dy = this.area.dyVisibleFrom; dy < this.area.dyVisibleTo; dy++) {
        if (this.area.groups[dx][dy][1].length > 0) {
          this.webgl.setBuffer(dx, dy, 0, 'a_position', 2, 0, 0)
          this.webgl.setBuffer(dx, dy, 1, 'a_shape', 1, 0, 0)
          this.webgl.setBuffer(dx, dy, 2, 'a_color', 1, 0, 0)
          this.webgl.setBuffer(dx, dy, 3, 'a_size', 1, 0, 0);

          [first, count] = this.getVisibleObjectsParams(this.area.groups[dx][dy][1].length, ratioObjectGroup)
          this.webgl.drawPoints(first, count)

          //zz++
          //console.log(`x=${this.camera.x}, y=${this.camera.y}, zoom=${this.camera.zoom}`)
        }
      }
    }
    //console.log('ratio = ' + ratioObjectGroup);
    //console.log('first = ' + first + '; count = ' + count);
    //console.log('zz = ', zz);
    //console.log(`x=${this.camera.x}, y=${this.camera.y}, zoom=${this.camera.zoom}`)
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

  arrayIterator() {
    if (this.data![this.arrayIndex]) {
      return this.data![this.arrayIndex++]
    } else {
      return null
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
