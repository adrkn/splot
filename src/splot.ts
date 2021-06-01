import { copyMatchingKeyValues, shuffleMatrix } from '@/utils'
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

  /** Цветовая палитра объектов. */
  public colors: string[] = []

  /** Параметры координатной плоскости. */
  public grid: SPlotGrid = {
    bgColor: '#ffffff',
    guideColor: '#c0c0c0'
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
    minObjectSize: 1_000_000,  // Значение заведомо превышающее любой размер объекта.
    maxObjectSize: 0,          // Значение заведомо меньше любого объекта.
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

  /** Информация о группировке и области видимости данных. */
  public area = {
    groups: [] as any[],  // Групповая матрица.
    step: 0.02,           // Делитель графика.
    count: 0,             // Количество частей графика по каждой размерности.
    dxVisibleFrom: 0,     // Ограничители видимой области групповой матрицы.
    dxVisibleTo: 0,
    dyVisibleFrom: 0,
    dyVisibleTo: 0,
    shuffledIndices: [] as any[],  // Перемешанные индексы групповой матрицы.
    objParamCount: 4,              // Количество параметров объекта (координаты, форма, размер, цвет и т.п.).
    objSignParamIndex: 1           // Индекс того параметра, у которого на один объект приходится одно значение.
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

    /** Вычисление размерности групповой матрицы (кол-во частей графика по каждой размерности). */
    this.area.count = Math.trunc(1 / this.area.step) + 1

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

    /** Если предоставлен массив с данными об объектах, то устанавливается итератор перебора массива. */
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

    /**
     * Если начальное положение области видимости и зумирование не были заданы явно, то эти параметры устанавливается
     * таким образом, чтобы при первом отображении область видимости была в центре графика и включала в себя все
     * объекты.
     */
    if (!('camera' in this.lastRequestedOptions)) {
      this.camera.zoom = Math.min(this.canvas.width, this.canvas.height) - this.stats.maxObjectSize
      this.camera.x = 0.5 - this.canvas.width / (2 * this.camera.zoom)
      this.camera.y = 0.5
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

    /** При каждом обновлении данных об объектах статистика сбрасывается. */
    this.stats = { objTotalCount: 0, groupsCount: 0, memUsage: 0, minObjectSize: 1_000_000, maxObjectSize: 0 }

    let dx, dy = 0
    let groups: any[] = []
    let object: SPlotObject | null
    let isObjectEnds: boolean = false

    /** Подготовка группировочной матрицы и матрицы случайных индексов. */
    for (let dx = 0; dx < this.area.count; dx++) {
      groups[dx] = []
      this.area.shuffledIndices[dx] = []
      for (let dy = 0; dy < this.area.count; dy++) {
        groups[dx][dy] = []
        this.area.shuffledIndices[dx][dy] = [dx, dy]
        for (let i = 0; i < this.area.objParamCount; i++) { groups[dx][dy][i] = [] }
      }
    }

    /** Перемешивание матрицы случайных индексов. */
    shuffleMatrix(this.area.shuffledIndices)

    /** Цикл чтения и подготовки данных об объектах. */
    while (!isObjectEnds) {

      /** Получение данных об очередном объекте. */
      object = this.iterator!()

      /** Объекты закончились, если итератор вернул null или если достигнут лимит числа объектов. */
      isObjectEnds = (object === null) || (this.stats.objTotalCount >= this.globalLimit)

      if (!isObjectEnds) {

        /** Проверка корректности и подготовка данных объекта. */
        object = this.checkObject(object!)

        /** Вычисление группы, в которую запишется объект. */
        dx = Math.trunc(object.x / this.area.step)
        dy = Math.trunc(object.y / this.area.step)

        /** Запись объекта. */
        groups[dx][dy][0].push(object.x, object.y)
        groups[dx][dy][1].push(object.shape)
        groups[dx][dy][2].push(object.color)
        groups[dx][dy][3].push(object.size)

        /** Нахождение минимального и максимального размеров объектов. */
        if (object.size > this.stats.maxObjectSize) { this.stats.maxObjectSize = object.size }
        if (object.size < this.stats.minObjectSize) { this.stats.minObjectSize = object.size }

        this.stats.objTotalCount++
      }
    }

    this.area.groups = groups

    /** Цикл копирования данных в видеопамять. */
    for (let dx = 0; dx < this.area.count; dx++) {
      for (let dy = 0; dy < this.area.count; dy++) {
        if (groups[dx][dy][this.area.objSignParamIndex].length > 0) {

          /** Создание видеобуферов, совмещенное с подсчетом занимаемой ими памяти. */
          this.stats.memUsage +=
            this.webgl.createBuffer(dx, dy, 0, new Float32Array(groups[dx][dy][0])) +
            this.webgl.createBuffer(dx, dy, 1, new Uint8Array(groups[dx][dy][1])) +
            this.webgl.createBuffer(dx, dy, 2, new Uint8Array(groups[dx][dy][2])) +
            this.webgl.createBuffer(dx, dy, 3, new Uint8Array(groups[dx][dy][3]))

          /** Количество созданных групп (буферов). */
          this.stats.groupsCount += this.area.objParamCount
        }
      }
    }

    this.debug.log('loaded')
  }

  /** ****************************************************************************
   *
   * Проверяет корректность параметров объекта и в случае необходимости вносит в них изменения.
   *
   * @param object - Данные об объекте.
   * @returns Скорректированные данные об объекте.
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

    /** Проверка корректности формы и цвета объекта. */
    if ((object.shape >= this.shapesCount!) || (object.shape < 0)) object.shape = 0
    if ((object.color >= this.colors.length) || (object.color < 0)) object.color = 0

    return object
  }

  /** ****************************************************************************
   *
   * Вычисляет видимую область групповой матрицы на основе области видимости скаттерплота.
   */
  updateVisibleArea(): void {

    const kx = this.canvas.width / (2 * this.camera.zoom!)
    const ky = this.canvas.height / (2 * this.camera.zoom!)

    /** Расчет границ области видимости в единичных координатах скаттерплота. */
    const cameraLeft = this.camera.x!
    const cameraRight = this.camera.x! + 2*kx
    const cameraTop = this.camera.y! - ky
    const cameraBottom = this.camera.y! + ky

    if ( (cameraLeft < 1) && (cameraRight > 0) && (cameraTop < 1) && (cameraBottom > 0) ) {

      /** Расчет видимой области матрицы, если область видимости скаттерплота находится в пределах графика. */
      this.area.dxVisibleFrom = (cameraLeft < 0) ? 0 : Math.trunc(cameraLeft / this.area.step)
      this.area.dxVisibleTo = (cameraRight > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraRight) / this.area.step)
      this.area.dyVisibleFrom = (cameraTop < 0) ? 0 : Math.trunc(cameraTop / this.area.step)
      this.area.dyVisibleTo = (cameraBottom > 1) ? this.area.count : this.area.count - Math.trunc((1 - cameraBottom) / this.area.step)
    } else {

      /** Если область видимости вне пределов графика, то групповая матрица не требует обхода. */
      this.area.dxVisibleFrom = 1
      this.area.dxVisibleTo = 0
      this.area.dyVisibleFrom = 1
      this.area.dyVisibleTo = 0
    }
  }

  /** ****************************************************************************
   *
   * Вычисляет отображаемую глубину группы объектов.
   *
   * @param totalCount - Общее количество объектов в группе.
   * @param ratio - Размерный коэффициент, показывающий соотношение между средним размером объектов и линейным размером
   *     группы объектов при текущем значении зумирования.
   * @returns Два параметра глубины отображаемой группы: [0] - индекс, с которого будет начинаться отображение объектов
   *     группы, [1] - количество отбражаемых объектов группы.
   */
  getVisibleObjectsParams(totalCount: number, ratio: number): number[] {

    let count: number = 0

    /** Расчет количества отображаемых объектов на основе размерного коэффициента. */
    if (ratio < 5) {
      count = 40 * ratio
    } else if (ratio < 10) {
      count = 70 * ratio
    } else {
      count = totalCount
    }

    /** Корректировка полученного количества. */
    count = Math.trunc(count)
    if (count > totalCount) { count = totalCount }
    if (count < 1) { count = 1 }

    return [totalCount - count, count]
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

    /** Вычисление видимой области групповой матрицы. */
    this.updateVisibleArea()

    /**
     * Вычисление размерного коэффициента, показывающего соотношение между средним размером объектов и линейным
     * размером группы объектов при текущем значении зумирования.
     */
    const ratioObjectGroup = (2 * this.camera.zoom! * this.area.step) / (this.stats.minObjectSize + this.stats.maxObjectSize)

    let first: number = 0
    let count: number = 0

    for (let i = 0; i < this.area.count; i++) {
      for (let j = 0; j < this.area.count; j++) {

        /** Индексы извлекаются из матрицы перемешанных индексов. */
        const [dx, dy] = this.area.shuffledIndices[i][j]

        /** Если текущий индекс лежит вне видимой области групповой матрицы, то он не итерируется. */
        if ( (dx < this.area.dxVisibleFrom) ||
          (dx > this.area.dxVisibleTo) ||
          (dy < this.area.dyVisibleFrom) ||
          (dy > this.area.dyVisibleTo) ) { continue }

        if (this.area.groups[dx][dy][this.area.objSignParamIndex].length > 0) {

          /** Если в текущей группе есть объекты, то делаем соответсвующие буферы активными. */
          this.webgl.setBuffer(dx, dy, 0, 'a_position', 2, 0, 0)
          this.webgl.setBuffer(dx, dy, 1, 'a_shape', 1, 0, 0)
          this.webgl.setBuffer(dx, dy, 2, 'a_color', 1, 0, 0)
          this.webgl.setBuffer(dx, dy, 3, 'a_size', 1, 0, 0); // Точка с запятой без которой ничего не работает ;-)

          /** Вычисление отображаемой глубины текущей группы. */
          [first, count] = this.getVisibleObjectsParams(
            this.area.groups[dx][dy][this.area.objSignParamIndex].length,
            ratioObjectGroup
          )

          /** Рендер группы. */
          this.webgl.drawPoints(first, count)
        }
      }
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
  checkSetup(): void {

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
   * Функция итерирования массива данных об объектах {@link this.data}. При каждом вызове возвращает очередной элемент
   * массива объектов.
   *
   * @returns Данные об очередном объекте или null, если массив закончился.
   */
  arrayIterator(): SPlotObject | null {
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
