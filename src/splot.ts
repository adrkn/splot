
function isObject(val: any) {
  return (val instanceof Object) && (val.constructor === Object)
}

/**
 * Генерирует случайное целое число в диапазоне от 0 до заданного предела. Сам
 * предел в диапазон не входит: [0...range-1].
 *
 * @private
 * @param {number} range Верхний предел диапазона случайного выбора.
 * @return {number} Сгенерированное случайное число.
 */
function randomInt(range: number) {
  return Math.floor(Math.random() * range);
}

type SPlotCalcShapeFunc = (x: number, y: number, consts: Array<any>) => SPlotPolygonVertices

/**
 * Цвет в HEX-формате.
 */
type HEXColor = string

/**
 * Функция итерирования массива исходных объектов. Каждый вызов такой функции
 * должен возвращать информацию об очередном полигоне, который необходимо
 * отобразить (его координаты, форму и цвет). Когда исходные объекты закончатся
 * функция должна вернуть null.
 */
type SPlotIterationFunction = () => SPlotPolygon | null

type SPlotDebugOutput = 'console' | 'document' | 'file'

type WebGlShaderType = 'VERTEX_SHADER' | 'FRAGMENT_SHADER'

type WebGlBufferType = 'ARRAY_BUFFER' | 'ELEMENT_ARRAY_BUFFER'

type WebGlVariableType = 'uniform' | 'attribute'

type TypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array

interface SPlotOptions {
  iterationCallback?: SPlotIterationFunction,
  polygonPalette?: HEXColor[],
  gridSize?: SPlotGridSize,
  polygonSize?: number,
  circleApproxLevel?: number,
  debugMode?: SPlotDebugMode,
  demoMode?: SPlotDemoMode,
  forceRun?: boolean,
  maxAmountOfPolygons?: number,
  bgColor?: HEXColor,
  rulesColor?: HEXColor,
  camera?: SPlotCamera,
  webGlSettings?: WebGLContextAttributes
}

interface SPlotPolygon {
  x: number,
  y: number,
  shape: number,
  color: number
}

interface SPlotGridSize {
  width: number,
  height: number
}

interface SPlotDebugMode {
  isEnable?: boolean,
  output?: SPlotDebugOutput
}

interface SPlotDemoMode {
  isEnable?: boolean,
  amount?: number,
  shapeQuota?: number[],
  index?: number
}

interface SPlotCamera {
  x: number,
  y: number,
  zoom: number
}

interface SPlotTransformation {
  matrix: number[],
  startInvMatrix: number[],
  startCameraX: number,
  startCameraY: number,
  startPosX: number,
  startPosY: number
}

interface SPlotBuffers {
  vertexBuffers: WebGLBuffer[],
  colorBuffers: WebGLBuffer[],
  indexBuffers: WebGLBuffer[],
  amountOfGLVertices: number[],
  amountOfShapes: number[],
  amountOfBufferGroups: number,
  amountOfTotalVertices: number,
  amountOfTotalGLVertices: number,
  sizeInBytes: number[]
}

interface SPlotPolygonGroup {
  vertices: number[],
  indices: number[],
  colors: number[],
  amountOfVertices: number,
  amountOfGLVertices: number
}

interface SPlotPolygonVertices {
  values: number[],
  indices: number[]
}

export default class SPlot {

  public static instances: { [key: string]: SPlot } = {}

  public iterationCallback?: SPlotIterationFunction

  public polygonPalette: HEXColor[] = [
    '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
    '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
  ]

  public gridSize: SPlotGridSize = {
    width: 32_000,
    height: 16_000
  }

  public polygonSize: number = 20

  public circleApproxLevel: number = 12

  public debugMode: SPlotDebugMode = {
    isEnable: false,
    output: 'console'
  }

  public demoMode: SPlotDemoMode = {
    isEnable: false,
    amount: 1_000_000,
    /**
     * По умолчанию в режиме демо-данных будут поровну отображаться
     * полигоны всех возможных форм. Соответствующие значения shapeQuota
     * инициализируются при регистрации функций создания форм (ниже по коду).
     */
    shapeQuota: [],
    index: 0
  }

  public forceRun: boolean = false

  public maxAmountOfPolygons: number = 1_000_000_000

  public bgColor: HEXColor = '#ffffff'

  public rulesColor: HEXColor = '#c0c0c0'

  public camera: SPlotCamera = {
    x: this.gridSize.width / 2,
    y: this.gridSize.height / 2,
    zoom: 1
  }

  public webGlSettings: WebGLContextAttributes = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
    failIfMajorPerformanceCaveat: false,
    desynchronized: false
  }

  protected canvas: HTMLCanvasElement

  protected gl!: WebGLRenderingContext

  protected variables: { [key: string]: any } = {}

  protected _vertexShaderCodeTemplate: string =
    'attribute vec2 a_position;\n' +
    'attribute float a_color;\n' +
    'uniform mat3 u_matrix;\n' +
    'varying vec3 v_color;\n' +
    'void main() {\n' +
    '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
    '  SET-VERTEX-COLOR-CODE' +
    '}\n'

  protected fragmentShaderCodeTemplate: string =
    'precision lowp float;\n' +
    'varying vec3 v_color;\n' +
    'void main() {\n' +
    '  gl_FragColor = vec4(v_color.rgb, 1.0);\n' +
    '}\n'

  protected amountOfPolygons: number = 0

  protected debugStyle: string = 'font-weight: bold; color: #ffffff;'

  protected USEFUL_CONSTS: any[] = []

  protected isRunning: boolean = false

  protected transormation: SPlotTransformation = {
    matrix: [],
    startInvMatrix: [],
    startCameraX: 0,
    startCameraY: 0,
    startPosX: 0,
    startPosY: 0
  }

  protected maxAmountOfVertexPerPolygonGroup: number = 32768 - (this.circleApproxLevel + 1);

  protected buffers: SPlotBuffers = {
    vertexBuffers: [],
    colorBuffers: [],
    indexBuffers: [],
    amountOfGLVertices: [],
    amountOfShapes: [],
    amountOfBufferGroups: 0,
    amountOfTotalVertices: 0,
    amountOfTotalGLVertices: 0,
    sizeInBytes: [0, 0, 0]
  }

  protected shapes: {calc: SPlotCalcShapeFunc, name: string}[] = []

  protected gpuProgram!: WebGLProgram

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

    // Сохранение ссылки на экземпляр класса. Позволяет внешим событиям получать доступ к полям и методам экземпляра.
    SPlot.instances[canvasId] = this

    if (document.getElementById(canvasId)) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    } else {
      throw new Error('Канвас с идентификатором "#' + canvasId +  '" не найден!')
    }

    /**
     * Регистрация трех базовых форм полигонов (треугольники, квадраты и круги). Наличие этих форм в указанном порядке
     * является обязательным для корректной работы приложения. Другие формы могут регистрироватья в любом количестве, в
     * любой последовательности.
     */
    this.registerShape(this.getVerticesOfTriangle, 'Треугольник')
    this.registerShape(this.getVerticesOfSquare, 'Квадрат')
    this.registerShape(this.getVerticesOfCircle, 'Круг')

    // Если переданы настройки, то они применяются.
    if (options) {
      this.setOptions(options)

      //  Если запрошен форсированный запуск, то инициализируются все необходимые для рендера параметры.
      if (this.forceRun) {
        this.setup(options)
      }
    }
  }

  /**
   * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
   */
  protected createGl(): void {

    this.gl = this.canvas.getContext('webgl', this.webGlSettings) as WebGLRenderingContext

    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * Регистрирует новую форму полигонов. Регистрация означает возможность в дальнейшем отображать на графике полигоны данной формы.
   *
   * @param polygonCalc - Функция вычисления координат вершин полигона данной формы.
   * @param polygonName - Название формы полигона.
   * @returns Индекс новой формы, по которому задается ее отображение на графике.
   */
  public registerShape(polygonCalc: SPlotCalcShapeFunc, polygonName: string): number {

    // Добавление формы в массив форм.
    this.shapes.push({
      calc: polygonCalc,
      name: polygonName
    })

    // Добавление формы в массив частот появления в демо-режиме.
    this.demoMode.shapeQuota!.push(1)

    // Полученный индекс формы в массиве форм.
    return this.shapes.length - 1
  }

  /**
   * Устанавливает необходимые для рендера параметры экземпляра и WebGL.
   *
   * @param options - Пользовательские настройки экземпляра.
   */
  public setup(options: SPlotOptions): void {

    // Применение пользовательских настроек.
    this.setOptions(options)

    // Создание контекста рендеринга.
    this.createGl()

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      this.reportMainInfo(options)
    }

    // Обнуление счетчика полигонов.
    this.amountOfPolygons = 0

    // Обнуление технического счетчика режима демо-данных
    this.demoMode.index = 0

    // Обнуление счетчиков числа использования различных форм полигонов.
    for (let i = 0; i < this.shapes.length; i++) {
      this.buffers.amountOfShapes[i] = 0
    }

    /**
     * Предельное количество вершин в группе полигонов зависит от параметра
     * circleApproxLevel, который мог быть изменен пользовательскими настройками.
     */
    this.maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1)

    // Инициализация вспомогательных констант.
    this.setUsefulConstants()

    // Установка цвета очистки рендеринга
    let [r, g, b] = this.convertColor(this.bgColor)
    this.gl.clearColor(r, g, b, 0.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    /**
     * Подготовка кодов шейдеров. В код вершинного шейдера вставляется код выбора цвета вершин. Код фрагментного
     * шейдера используется без изменений.
     */
    let vertexShaderCode = this._vertexShaderCodeTemplate.replace('SET-VERTEX-COLOR-CODE', this.genShaderColorCode())
    let fragmentShaderCode = this.fragmentShaderCodeTemplate

    // Создание шейдеров WebGL.
    let vertexShader = this.createWebGlShader('VERTEX_SHADER', vertexShaderCode)
    let fragmentShader = this.createWebGlShader('FRAGMENT_SHADER', fragmentShaderCode)

    // Создание программы WebGL.
    this.createWebGlProgram(vertexShader, fragmentShader)

    // Установка связей переменных приложения с программой WebGl.
    this.setWebGlVariable('attribute', 'a_position')
    this.setWebGlVariable('attribute', 'a_color')
    this.setWebGlVariable('uniform', 'u_matrix')

    // Вычисление данных обо всех полигонах и заполнение ими буферов WebGL.
    this.createWbGlBuffers()

    // Если необходимо, то рендеринг запускается сразу после установки параметров экземпляра.
    if (this.forceRun) {
      this.run()
    }
  }

  /**
   * Применяет пользовательские настройки экземпляра.
   *
   * @param options - Пользовательские настройки экземпляра.
   */
  protected setOptions(options: SPlotOptions): void {

    /**
     * Копирование пользовательских настроек в соответсвующие поля экземпляра. Копируются только те из них, которым
     * имеются соответствующие эквиваленты в полях экземпляра. Копируется также первый уровень вложенных настроек.
     */
    for (let option in options) {

      if (!this.hasOwnProperty(option)) continue

      if (isObject((options as any)[option]) && isObject((this as any)[option]) ) {
        for (let nestedOption in (options as any)[option]) {
          if ((this as any)[option].hasOwnProperty(nestedOption)) {
            (this as any)[option][nestedOption] = (options as any)[option][nestedOption]
          }
        }
      } else {
        (this as any)[option] = (options as any)[option]
      }
    }

    /**
     * Если пользователь задает размер плоскости, но при этом на задает начальное положение области просмотра, то
     * область просмотра помещается в центр заданной плоскости.
     */
    if (options.hasOwnProperty('gridSize') && !options.hasOwnProperty('camera')) {
      this.camera = {
        x: this.gridSize.width / 2,
        y: this.gridSize.height / 2,
        zoom: 1
      }
    }

    /**
     * Если запрошен демо-режим, то для итерирования объектов будет использоваться внутренний имитирующий итерирование
     * метод. При этом внешняя функция итерирования использована не будет.
     */
    if (this.demoMode.isEnable) {
      this.iterationCallback = this.demoIterationCallback
    }
  }

  /**
   * Вычисляет набор вспомогательных констант {@link USEFUL_CONSTS}, хранящих результаты алгебраических и
   * тригонометрических вычислений, используемых в расчетах вершин полигонов и матриц трансформации.
   *
   * @remarks
   * Такие константы позволяют вынести затратные для процессора операции за пределы многократно используемых функций
   * увеличивая производительность приложения на этапах подготовки данных и рендеринга.
   */
  protected setUsefulConstants(): void {

    // Константы, зависящие от размера полигона.
    this.USEFUL_CONSTS[0] = this.polygonSize / 2
    this.USEFUL_CONSTS[1] = this.USEFUL_CONSTS[0] / Math.cos(Math.PI / 6)
    this.USEFUL_CONSTS[2] = this.USEFUL_CONSTS[0] * Math.tan(Math.PI / 6)

    // Константы, зависящие от степени детализации круга и размера полигона.
    this.USEFUL_CONSTS[3] = new Float32Array(this.circleApproxLevel)
    this.USEFUL_CONSTS[4] = new Float32Array(this.circleApproxLevel)

    for (let i = 0; i < this.circleApproxLevel; i++) {
      const angle = 2 * Math.PI * i / this.circleApproxLevel
      this.USEFUL_CONSTS[3][i] = this.USEFUL_CONSTS[0] * Math.cos(angle)
      this.USEFUL_CONSTS[4][i] = this.USEFUL_CONSTS[0] * Math.sin(angle)
    }

    // Константы, зависящие от размера канваса.
    this.USEFUL_CONSTS[5] = 2 / this.canvas.width
    this.USEFUL_CONSTS[6] = 2 / this.canvas.height
    this.USEFUL_CONSTS[7] = 2 / this.canvas.clientWidth
    this.USEFUL_CONSTS[8] = -2 / this.canvas.clientHeight
    this.USEFUL_CONSTS[9] = this.canvas.getBoundingClientRect().left
    this.USEFUL_CONSTS[10] = this.canvas.getBoundingClientRect().top
  }

  /**
   * Создает шейдер WebGL.
   *
   * @param shaderType Тип шейдера.
   * @param shaderCode Код шейдера на языке GLSL.
   * @returns Созданный объект шейдера.
   */
  protected createWebGlShader(shaderType: WebGlShaderType, shaderCode: string): WebGLShader {

    // Создание, привязка кода и компиляция шейдера.
    const shader = this.gl.createShader(this.gl[shaderType]) as WebGLShader
    this.gl.shaderSource(shader, shaderCode)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this.gl.getShaderInfoLog(shader))
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.group('%cСоздан шейдер [' + shaderType + ']', this.debugStyle)
      {
        console.log(shaderCode)
      }
      console.groupEnd()
    }

    return shader
  }

  /**
   * Создает программу WebGL.
   *
   * @param {WebGLShader} vertexShader Вершинный шейдер.
   * @param {WebGLShader} fragmentShader Фрагментный шейдер.
   */
  protected createWebGlProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {

    this.gpuProgram = this.gl.createProgram() as WebGLProgram

    this.gl.attachShader(this.gpuProgram, vertexShader)
    this.gl.attachShader(this.gpuProgram, fragmentShader)
    this.gl.linkProgram(this.gpuProgram)

    if (!this.gl.getProgramParameter(this.gpuProgram, this.gl.LINK_STATUS)) {
      throw new Error('Ошибка создания программы WebGL. ' + this.gl.getProgramInfoLog(this.gpuProgram))
    }

    this.gl.useProgram(this.gpuProgram)
  }

  /**
   * Устанавливает связь переменной приложения с программой WebGl.
   *
   * @param varType Тип переменной.
   * @param varName Имя переменной.
   */
  protected setWebGlVariable(varType: WebGlVariableType, varName: string): void {
    if (varType === 'uniform') {
      this.variables[varName] = this.gl.getUniformLocation(this.gpuProgram, varName)
    } else if (varType === 'attribute') {
      this.variables[varName] = this.gl.getAttribLocation(this.gpuProgram, varName)
    }
  }

  /**
   * Создает и заполняет данными обо всех полигонах буферы WebGL.
   */
  protected createWbGlBuffers(): void {

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cЗапущен процесс загрузки данных [' + this.getCurrentTime() + ']...', this.debugStyle)

      // Запуск консольного таймера, измеряющего длительность процесса загрузки данных в видеопамять.
      console.time('Длительность')
    }

    let polygonGroup: SPlotPolygonGroup | null

    // Итерирование групп полигонов.
    while (polygonGroup = this.createPolygonGroup()) {

      // Создание и заполнение буферов данными о текущей группе полигонов.
      this.addWbGlBuffer(this.buffers.vertexBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.vertices), 0)
      this.addWbGlBuffer(this.buffers.colorBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.colors), 1)
      this.addWbGlBuffer(this.buffers.indexBuffers, 'ELEMENT_ARRAY_BUFFER', new Uint16Array(polygonGroup.indices), 2)

      // Счетчик количества буферов.
      this.buffers.amountOfBufferGroups++

      // Счетчик количества вершин GL-треугольников текущей группы буферов.
      this.buffers.amountOfGLVertices.push(polygonGroup.amountOfGLVertices)

      // Счетчик общего количества вершин GL-треугольников.
      this.buffers.amountOfTotalGLVertices += polygonGroup.amountOfGLVertices
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      this.reportAboutObjectReading()
    }
  }

  /**
   * Считывает данные об исходных объектах и формирует соответсвующую этим объектам группу полигонов.
   *
   * @remarks
   * Группа формируется с учетом технического ограничения на количество вершин в группе и лимита на общее количество
   * полигонов на канвасе.
   *
   * @returns Созданная группа полигонов или null, если формирование всех групп полигонов завершилось.
   */
  protected createPolygonGroup(): SPlotPolygonGroup | null {

    let polygonGroup: SPlotPolygonGroup = {
      vertices: [],
      indices: [],
      colors: [],
      amountOfVertices: 0,
      amountOfGLVertices: 0
    }

    let polygon: SPlotPolygon | null

    /**
     * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая обработка исходных объектов
     * приостанавливается - формирование групп полигонов завершается возвратом значения null (симуляция достижения
     * последнего обрабатываемого исходного объекта).
     */
    if (this.amountOfPolygons >= this.maxAmountOfPolygons) return null

    // Итерирование исходных объектов.
    while (polygon = this.iterationCallback!()) {

      // Добавление в группу полигонов нового полигона.
      this.addPolygon(polygonGroup, polygon)

      // Счетчик числа применений каждой из форм полигонов.
      this.buffers.amountOfShapes[polygon.shape]++

      // Счетчик общего количество полигонов.
      this.amountOfPolygons++

      /**
       * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая обработка исходных объектов
       * приостанавливается - формирование групп полигонов завершается возвратом значения null (симуляция достижения
       * последнего обрабатываемого исходного объекта).
       */
      if (this.amountOfPolygons >= this.maxAmountOfPolygons) break

      /**
       * Если общее количество всех вершин в группе полигонов превысило техническое ограничение, то группа полигонов
       * считается сформированной и итерирование исходных объектов приостанавливается.
       */
      if (polygonGroup.amountOfVertices >= this.maxAmountOfVertexPerPolygonGroup) break
    }

    // Счетчик общего количества вершин всех вершинных буферов.
    this.buffers.amountOfTotalVertices += polygonGroup.amountOfVertices

    // Если группа полигонов непустая, то возвращаем ее. Если пустая - возвращаем null.
    return (polygonGroup.amountOfVertices > 0) ? polygonGroup : null
  }

  /**
   * Создает в массиве буферов WebGL новый буфер и записывает в него переданные данные.
   *
   * @param buffers - Массив буферов WebGL, в который будет добавлен создаваемый буфер.
   * @param type - Тип создаваемого буфера.
   * @param data - Данные в виде типизированного массива для записи в создаваемый буфер.
   * @param key - Ключ (индекс), идентифицирующий тип буфера (для вершин, для цветов, для индексов). Используется для
   *     раздельного подсчета памяти, занимаемой каждым типом буфера.
   */
  protected addWbGlBuffer(buffers: WebGLBuffer[], type: WebGlBufferType, data: TypedArray, key: number): void {

    // Определение индекса нового элемента в массиве буферов WebGL.
    const index = this.buffers.amountOfBufferGroups

    // Создание и заполнение данными нового буфера.
    buffers[index] = this.gl.createBuffer()!
    this.gl.bindBuffer(this.gl[type], buffers[index])
    this.gl.bufferData(this.gl[type], data, this.gl.STATIC_DRAW)

    // Счетчик памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
    this.buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT
  }

  /**
   * Вычисляет координаты вершин полигона треугольной формы.
   *
   * @param x - Положение центра полигона на оси абсцисс.
   * @param y - Положение центра полигона на оси ординат.
   * @param consts - Набор вспомогательных констант, используемых для вычисления вершин.
   * @returns Данные о вершинах полигона.
   */
  protected getVerticesOfTriangle(x: number, y: number, consts: any[]): SPlotPolygonVertices {

    const [x1, y1] = [x - consts[0], y + consts[2]]
    const [x2, y2] = [x, y - consts[1]]
    const [x3, y3] = [x + consts[0], y + consts[2]]

    const vertices = {
      values: [x1, y1, x2, y2, x3, y3],
      indices: [0, 1, 2]
    }

    return vertices
  }

  /**
   * Вычисляет координаты вершин полигона квадратной формы.
   *
   * @param x - Положение центра полигона на оси абсцисс.
   * @param y - Положение центра полигона на оси ординат.
   * @param consts - Набор вспомогательных констант, используемых для вычисления вершин.
   * @returns Данные о вершинах полигона.
   */
  protected getVerticesOfSquare(x: number, y: number, consts: any[]): SPlotPolygonVertices {

    const [x1, y1] = [x - consts[0], y - consts[0]]
    const [x2, y2] = [x + consts[0], y + consts[0]]

    const vertices = {
      values: [x1, y1, x2, y1, x2, y2, x1, y2],
      indices: [0, 1, 2, 0, 2, 3]
    }

    return vertices
  }

  /**
   * Вычисляет координаты вершин полигона круглой формы.
   *
   * @param x - Положение центра полигона на оси абсцисс.
   * @param y - Положение центра полигона на оси ординат.
   * @param consts - Набор вспомогательных констант, используемых для вычисления вершин.
   * @returns Данные о вершинах полигона.
   */
  protected getVerticesOfCircle(x: number, y: number, consts: any[]): SPlotPolygonVertices {

    // Занесение в набор вершин центра круга.
    const vertices: SPlotPolygonVertices = {
      values: [x, y],
      indices: []
    }

    // Добавление апроксимирующих окружность круга вершин.
    for (let i = 0; i < consts[3].length; i++) {
      vertices.values.push(x + consts[3][i], y + consts[4][i])
      vertices.indices.push(0, i + 1, i + 2)
    }

    /**
     * Последняя вершина последнего GL-треугольника заменяется на первую апроксимирующую
     * окружность круга вершину, замыкая апроксимирущий круг полигон.
     */
    vertices.indices[vertices.indices.length - 1] = 1

    return vertices
  }

  /**
   * Создает и добавляет в группу полигонов новый полигон.
   *
   * @param polygonGroup - Группа полигонов, в которую происходит добавление.
   * @param polygon - Информация о добавляемом полигоне.
   */
  protected addPolygon(polygonGroup: SPlotPolygonGroup, polygon: SPlotPolygon): void {

    /**
     * В зависимости от формы полигона и координат его центра вызывается соответсвующая функция нахождения координат его
     * вершин.
     */
    const vertices = this.shapes[polygon.shape].calc(
      polygon.x, polygon.y, this.USEFUL_CONSTS
    )

    // Количество вершин - это количество пар чисел в массиве вершин.
    const amountOfVertices = Math.trunc(vertices.values.length / 2)

    // Нахождение индекса первой добавляемой в группу полигонов вершины.
    const indexOfLastVertex = polygonGroup.amountOfVertices

    /**
     * Номера индексов вершин - относительные. Для вычисления абсолютных индексов необходимо прибавить к относительным
     * индексам индекс первой добавляемой в группу полигонов вершины.
     */
    for (let i = 0; i < vertices.indices.length; i++) {
      vertices.indices[i] += indexOfLastVertex
    }

    /**
     * Добавление в группу полигонов индексов вершин нового полигона и подсчет общего количества вершин GL-треугольников
     * в группе.
     */
    polygonGroup.indices.push(...vertices.indices)
    polygonGroup.amountOfGLVertices += vertices.indices.length

    // Добавление в группу полигонов вершин нового полигона и подсчет общего количества вершин в группе.
    polygonGroup.vertices.push(...vertices.values)
    polygonGroup.amountOfVertices += amountOfVertices

    // Добавление цветов вершин - по одному цвету на каждую вершину.
    for (let i = 0; i < amountOfVertices; i++) {
      polygonGroup.colors.push(polygon.color)
    }
  }

  /**
   * Выводит базовую часть отладочной информации.
   *
   * @param options - Пользовательские настройки экземпляра.
   */
  protected reportMainInfo(options: SPlotOptions): void {

    console.log('%cВключен режим отладки ' + this.constructor.name + ' [#' + this.canvas.id + ']',
      this.debugStyle + ' background-color: #cc0000;')

    if (this.demoMode.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this.debugStyle)
    }

    console.group('%cПредупреждение', this.debugStyle)
    {
      console.dir('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90')
    }
    console.groupEnd()

    console.group('%cВидеосистема', this.debugStyle)
    {
      let ext = this.gl.getExtension('WEBGL_debug_renderer_info')
      let graphicsCardName = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]'
      console.log('Графическая карта: ' + graphicsCardName)
      console.log('Версия GL: ' + this.gl.getParameter(this.gl.VERSION))
    }
    console.groupEnd()

    console.group('%cНастройка параметров экземпляра', this.debugStyle)
    {
      console.dir(this)
      console.log('Заданы параметры:\n', JSON.stringify(options, null, ' '))
      console.log('Канвас: #' + this.canvas.id)
      console.log('Размер канваса: ' + this.canvas.width + ' x ' + this.canvas.height + ' px')
      console.log('Размер плоскости: ' + this.gridSize.width + ' x ' + this.gridSize.height + ' px')
      console.log('Размер полигона: ' + this.polygonSize + ' px')
      console.log('Апроксимация окружности: ' + this.circleApproxLevel + ' углов')
      console.log('Функция перебора: ' + this.iterationCallback!.name)
    }
    console.groupEnd()
  }

  /**
   * Выводит в консоль отладочную информацию о загрузке данных в видеопамять.
   */
  protected reportAboutObjectReading(): void {

    console.group('%cЗагрузка данных завершена [' + this.getCurrentTime() + ']', this.debugStyle)
    {
      console.timeEnd('Длительность')

      console.log('Результат: ' +
        ((this.amountOfPolygons >= this.maxAmountOfPolygons) ? 'достигнут заданный лимит (' +
          this.maxAmountOfPolygons.toLocaleString() + ')' : 'обработаны все объекты'))

      console.group('Кол-во объектов: ' + this.amountOfPolygons.toLocaleString())
      {
        for (let i = 0; i < this.shapes.length; i++) {
          const shapeCapction = this.shapes[i].name
          const shapeAmount = this.buffers.amountOfShapes[i]
          console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
            ' [~' + Math.round(100 * shapeAmount / this.amountOfPolygons) + '%]')
        }

        console.log('Палитра: ' + this.polygonPalette.length + ' цветов')
      }
      console.groupEnd()

      let bytesUsedByBuffers = this.buffers.sizeInBytes[0] + this.buffers.sizeInBytes[1] + this.buffers.sizeInBytes[2]

      console.group('Занято видеопамяти: ' + (bytesUsedByBuffers / 1000000).toFixed(2).toLocaleString() + ' МБ')
      {
        console.log('Буферы вершин: ' +
          (this.buffers.sizeInBytes[0] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
          ' [~' + Math.round(100 * this.buffers.sizeInBytes[0] / bytesUsedByBuffers) + '%]')

        console.log('Буферы цветов: '
          + (this.buffers.sizeInBytes[1] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
          ' [~' + Math.round(100 * this.buffers.sizeInBytes[1] / bytesUsedByBuffers) + '%]')

        console.log('Буферы индексов: '
          + (this.buffers.sizeInBytes[2] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
          ' [~' + Math.round(100 * this.buffers.sizeInBytes[2] / bytesUsedByBuffers) + '%]')
      }
      console.groupEnd()

      console.log('Кол-во групп буферов: ' + this.buffers.amountOfBufferGroups.toLocaleString())
      console.log('Кол-во GL-треугольников: ' + (this.buffers.amountOfTotalGLVertices / 3).toLocaleString())
      console.log('Кол-во вершин: ' + this.buffers.amountOfTotalVertices.toLocaleString())
    }
    console.groupEnd()
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
    this.polygonPalette.push(this.rulesColor)

    let code: string = ''

    for (let i = 0; i < this.polygonPalette.length; i++) {

      // Получение цвета в нужном формате.
      let [r, g, b] = this.convertColor(this.polygonPalette[i])

      // Формировние строк GLSL-кода проверки индекса цвета.
      code += ((i === 0) ? '' : '  else ') + 'if (a_color == ' + i + '.0) v_color = vec3(' +
        r.toString().slice(0, 9) + ',' +
        g.toString().slice(0, 9) + ',' +
        b.toString().slice(0, 9) + ');\n'
    }

    // Удаление из палитры вершин временно добавленного цвета направляющих.
    this.polygonPalette.pop()

    return code
  }

  /**
   * Конвертирует цвет из HEX-представления в представление цвета для GLSL-кода (RGB с диапазонами значений от 0 до 1).
   *
   * @param hexColor - Цвет в HEX-формате.
   * @returns Массив из трех чисел в диапазоне от 0 до 1.
   */
  protected convertColor(hexColor: HEXColor): number[] {

    let k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
    let [r, g, b] = [parseInt(k![1], 16) / 255, parseInt(k![2], 16) / 255, parseInt(k![3], 16) / 255]

    return [r, g, b]
  }

  /**
   * Вычисляет текущее время.
   *
   * @returns Строковая форматированная запись текущего времени.
   */
  protected getCurrentTime(): string {

    let today = new Date();

    let time =
      ((today.getHours() < 10 ? '0' : '') + today.getHours()) + ":" +
      ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) + ":" +
      ((today.getSeconds() < 10 ? '0' : '') + today.getSeconds())

    return time
  }

  /**
   * Обновляет матрицу трансформации.
   *
   * @remarks
   * Существует два варианта вызова метода - из другого метода экземпляра ({@link render}) и из обработчика события мыши
   * ({@link handleMouseWheel}). Во втором варианте использование объекта this невозможно. Для универсальности вызова
   * метода - в него всегда явно необходимо передавать ссылку на экземпляр класса.
   *
   * @param $this - Экземпляр класса, чью матрицу трансформации необходимо обновить.
   */
  protected updateTransMatrix($this: SPlot): void {

    const t1 = $this.camera.zoom * $this.USEFUL_CONSTS[5]
    const t2 = $this.camera.zoom * $this.USEFUL_CONSTS[6]

    $this.transormation.matrix = [
      t1, 0, 0, 0, -t2, 0, -$this.camera.x * t1 - 1, $this.camera.y * t2 + 1, 1
    ]
  }

  /**
   * Реагирует на движение мыши/трекпада в момент, когда ее/его клавиша удерживается нажатой.
   *
   * @remerks
   * Метод перемещает область видимости на плоскости вместе с движением мыши/трекпада. Вычисления внутри события сделаны
   * максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект this
   * недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
   * класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseMove(event: MouseEvent): void {

    // Получение доступа к объекту this.
    const $this = SPlot.instances[ (event.target as HTMLElement).id ]

    $this.camera.x = $this.transormation.startCameraX + $this.transormation.startPosX -
      ((event.clientX - $this.USEFUL_CONSTS[9]) * $this.USEFUL_CONSTS[7] - 1) * $this.transormation.startInvMatrix[0] -
      $this.transormation.startInvMatrix[6]

    $this.camera.y = $this.transormation.startCameraY + $this.transormation.startPosY -
      ((event.clientY - $this.USEFUL_CONSTS[10]) * $this.USEFUL_CONSTS[8] + 1) * $this.transormation.startInvMatrix[4] -
      $this.transormation.startInvMatrix[7]

    // Рендеринг с обновленными параметрами трансформации.
    $this.render()
  }

  /**
   * Реагирует на нажатие клавиши мыши/трекпада.
   *
   * @remerks
   * В момент нажатия и удержания клавиши запускается анализ движения мыши/трекпада (с зажатой клавишей). Вычисления
   * внутри события сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике
   * событий объект this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех
   * созданных экземпляров класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseDown(event: MouseEvent): void {

    event.preventDefault()

    // Получение доступа к объекту this.
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    // Сразу после начала удержания клавиши запускется "прослушка" событий движения и отжатия клавиши.
    event.target!.addEventListener('mousemove', $this.handleMouseMove as EventListener)
    event.target!.addEventListener('mouseup', $this.handleMouseUp as EventListener)

    $this.transormation.startInvMatrix = [
      1 / $this.transormation.matrix[0], 0, 0, 0, 1 / $this.transormation.matrix[4],
      0, -$this.transormation.matrix[6] / $this.transormation.matrix[0],
      -$this.transormation.matrix[7] / $this.transormation.matrix[4], 1
    ];

    $this.transormation.startCameraX = $this.camera.x
    $this.transormation.startCameraY = $this.camera.y

    $this.transormation.startPosX =
      ((event.clientX - $this.USEFUL_CONSTS[9]) * $this.USEFUL_CONSTS[7] - 1) *
      $this.transormation.startInvMatrix[0] + $this.transormation.startInvMatrix[6]

    $this.transormation.startPosY =
      ((event.clientY - $this.USEFUL_CONSTS[10]) * $this.USEFUL_CONSTS[8] + 1) *
      $this.transormation.startInvMatrix[4] + $this.transormation.startInvMatrix[7]
  }

  /**
   * Реагирует на отжатие клавиши мыши/трекпада.
   *
   * @remerks
   * В момент отжатия клавиши анализ движения мыши/трекпада с зажатой клавишей прекращается. Вычисления внутри события
   * сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект
   * this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
   * класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseUp(event: MouseEvent): void {

    // Получение доступа к объекту this.
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    // Сразу после отжатия клавиши "прослушка" событий движения и отжатия клавиши прекращаются.
    event.target!.removeEventListener('mousemove', $this.handleMouseMove as EventListener)
    event.target!.removeEventListener('mouseup', $this.handleMouseUp as EventListener)
  }

  /**
   * Реагирует на зумирование мыши/трекпада.
   *
   * @remerks
   * В момент зумирования мыши/трекпада происходит зумирование координатной плоскости. Вычисления внутри события
   * сделаны максимально производительными в ущерб читабельности логики действий. Во внешнем обработчике событий объект
   * this недоступен поэтому доступ к экземпляру класса реализуется через статический массив всех созданных экземпляров
   * класса и идентификатора канваса, выступающего индексом в этом массиве.
   *
   * @param event - Событие мыши/трекпада.
   */
  protected handleMouseWheel(event: WheelEvent): void {

    event.preventDefault()

    // Получение доступа к объекту this.
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    const clipX = (event.clientX - $this.USEFUL_CONSTS[9]) * $this.USEFUL_CONSTS[7] - 1
    const clipY = (event.clientY - $this.USEFUL_CONSTS[10]) * $this.USEFUL_CONSTS[8] + 1

    const preZoomX = (clipX - $this.transormation.matrix[6]) / $this.transormation.matrix[0]
    const preZoomY = (clipY - $this.transormation.matrix[7]) / $this.transormation.matrix[4]

    const newZoom = $this.camera.zoom * Math.pow(2, event.deltaY * -0.01)
    $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom))

    $this.updateTransMatrix($this)

    const postZoomX = (clipX - $this.transormation.matrix[6]) / $this.transormation.matrix[0]
    const postZoomY = (clipY - $this.transormation.matrix[7]) / $this.transormation.matrix[4]

    $this.camera.x += (preZoomX - postZoomX)
    $this.camera.y += (preZoomY - postZoomY)

    // Рендеринг с обновленными параметрами трансформации.
    $this.render()
  }

  /**
   * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
   */
  protected render(): void {

    // Очистка объекта рендеринга WebGL.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    // Обновление матрицы трансформации.
    this.updateTransMatrix(this)

    // Привязка матрицы трансформации к переменной шейдера.
    this.gl.uniformMatrix3fv(this.variables['u_matrix'], false, this.transormation.matrix)

    // Итерирование и рендеринг групп буферов WebGL.
    for (let i = 0; i < this.buffers.amountOfBufferGroups; i++) {

      // Установка текущего буфера вершин и его привязка к переменной шейдера.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffers[i])
      this.gl.enableVertexAttribArray(this.variables['a_position'])
      this.gl.vertexAttribPointer(this.variables['a_position'], 2, this.gl.FLOAT, false, 0, 0)

      // Установка текущего буфера цветов вершин и его привязка к переменной шейдера.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colorBuffers[i])
      this.gl.enableVertexAttribArray(this.variables['a_color'])
      this.gl.vertexAttribPointer(this.variables['a_color'], 1, this.gl.UNSIGNED_BYTE, false, 0, 0)

      // Установка текущего буфера индексов вершин.
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffers[i])

      // Рендеринг текущей группы буферов.
      this.gl.drawElements(this.gl.TRIANGLES, this.buffers.amountOfGLVertices[i],
        this.gl.UNSIGNED_SHORT, 0)
    }
  }

  /**
   * Случайным образом возвращает один из индексов числового одномерного массива. Несмотря на случайность каждого
   * конкретного вызова функции, индексы возвращаются с предопределенной частотой. Частота "выпаданий" индексов задается
   * соответствующими значениями элементов.
   *
   * @remarks
   * Пример: На массиве [3, 2, 5] функция будет возвращать индекс 0 с частотой = 3/(3+2+5) = 3/10, индекс 1 с частотой =
   * 2/(3+2+5) = 2/10, индекс 2 с частотой = 5/(3+2+5) = 5/10.
   *
   * @param arr - Числовой одномерный массив, индексы которого будут возвращаться с предопределенной частотой.
   * @returns Случайный индекс из массива arr.
   */
  protected randomQuotaIndex(arr: number[]): number {

    let a: number[] = []
    a[0] = arr[0]

    for (let i = 1; i < arr.length; i++) {
      a[i] = a[i - 1] + arr[i]
    }

    const lastIndex: number = a.length - 1

    let r: number = Math.floor((Math.random() * a[lastIndex])) + 1
    let l: number = 0
    let h: number = lastIndex

    while (l < h) {
      const m: number = l + ((h - l) >> 1);
      (r > a[m]) ? (l = m + 1) : (h = m)
    }

    return (a[l] >= r) ? l : -1
  }

  /**
   * Метод имитации итерирования исходных объектов. При каждом новом вызове возвращает информацию о полигоне со случаным
   * положением, случайной формой и случайным цветом.
   *
   * @returns Информация о полигоне или null, если перебор исходных объектов закончился.
   */
  protected demoIterationCallback(): SPlotPolygon | null {
    if (this.demoMode.index! < this.demoMode.amount!) {
      this.demoMode.index! ++;
      return {
        x: randomInt(this.gridSize.width),
        y: randomInt(this.gridSize.height),
        shape: this.randomQuotaIndex(this.demoMode.shapeQuota!),
        color: randomInt(this.polygonPalette.length)
      }
    }
    else
      return null
  }

  /**
   * Запускает рендеринг и "прослушку" событий мыши/трекпада на канвасе.
   */
  public run(): void {
    if (!this.isRunning) {

      this.canvas.addEventListener('mousedown', this.handleMouseDown)
      this.canvas.addEventListener('wheel', this.handleMouseWheel)

      this.render()

      this.isRunning = true
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cРендеринг запущен', this.debugStyle)
    }
  }

  /**
   * Останавливает рендеринг и "прослушку" событий мыши/трекпада на канвасе.
   *
   * @param clear Признак неообходимости вместе с остановкой рендеринга очистить канвас. Значение true очищает канвас,
   * значение false - оставляет его неочищенным. По умолчанию очистка не происходит.
   */
  public stop(clear: boolean = false): void {

    if (this.isRunning) {

      this.canvas.removeEventListener('mousedown', this.handleMouseDown)
      this.canvas.removeEventListener('wheel', this.handleMouseWheel)
      this.canvas.removeEventListener('mousemove', this.handleMouseMove)
      this.canvas.removeEventListener('mouseup', this.handleMouseUp)

      if (clear) {
        this.clear()
      }

      this.isRunning = false
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cРендеринг остановлен', this.debugStyle)
    }
  }

  /**
   * Очищает канвас, закрашивая его в фоновый цвет.
   */
  public clear(): void {

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cКонтекст рендеринга очищен [' + this.bgColor + ']', this.debugStyle);
    }
  }
}
