
function isObject(val: any) {
  return (val instanceof Object) && (val.constructor === Object);
}

type SPlotShapeFunction = (x: number, y: number, consts: Array<any>) => SPlotPolygonVertices

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

type SPlotWebGlVariables = {
  name: string,
  type: WebGlVariableType,
  value: WebGLUniformLocation | GLint
}

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
     * По умолчанию в режиме демонстрационных данных будут поровну отображаться
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

  protected _canvas: HTMLCanvasElement

  protected _gl!: WebGLRenderingContext

  protected _variables: { [key: string]: any } = []

  protected _vertexShaderCodeTemplate: string =
    'attribute vec2 a_position;\n' +
    'attribute float a_color;\n' +
    'uniform mat3 u_matrix;\n' +
    'varying vec3 v_color;\n' +
    'void main() {\n' +
    '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
    '  SET-VERTEX-COLOR-CODE' +
    '}\n'

  protected _fragmentShaderCodeTemplate: string =
    'precision lowp float;\n' +
    'varying vec3 v_color;\n' +
    'void main() {\n' +
    '  gl_FragColor = vec4(v_color.rgb, 1.0);\n' +
    '}\n'

  protected _amountOfPolygons: number = 0

  protected _debugStyle: string = 'font-weight: bold; color: #ffffff;'

  protected _USEFUL_CONSTS: any[] = []

  protected _isRunning: boolean = false

  protected _transormation: SPlotTransformation = {
    matrix: [],
    startInvMatrix: [],
    startCameraX: 0,
    startCameraY: 0,
    startPosX: 0,
    startPosY: 0
  }

  protected _maxAmountOfVertexPerPolygonGroup: number = 32768 - (this.circleApproxLevel + 1);

  protected _buffers: SPlotBuffers = {
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

  protected _getVertices: {func: SPlotShapeFunction, caption: string}[] = []

  protected _gpuProgram!: WebGLProgram

  constructor(canvasId: string, options?: SPlotOptions) {

    SPlot.instances[canvasId] = this

    this._canvas = document.getElementById(canvasId) as HTMLCanvasElement

    if (options) {

      this._setOptions(options)

      if (this.forceRun) {
        this.setup(options)
      }
    }

    this.registerPolygonShape(this._getVerticesOfTriangle, 'Треугольник')
    this.registerPolygonShape(this._getVerticesOfSquare, 'Квадрат')
    this.registerPolygonShape(this._getVerticesOfCircle, 'Круг')
  }

  /**
   * Создает и инициализирует объекты рендеринга WebGL.
   *
   * @private
   * @param {string} canvasId Идентификатор элемента <canvas>.
   */
  _createWebGl() {

    this._gl = this._canvas.getContext('webgl', this.webGlSettings) as WebGLRenderingContext

    // Выравнивание области рендеринга в соответствии с размером канваса.
    this._canvas.width = this._canvas.clientWidth;
    this._canvas.height = this._canvas.clientHeight;
    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
  }

  registerPolygonShape(polygonFunc: SPlotShapeFunction, polygonCaption: string) {

    // Занесение функции и названия формы в массив. Форма будет кодироваться индексом в этом массиве.
    this._getVertices.push({
      func: polygonFunc,
      caption: polygonCaption
    });

    // Добавление новой формы в массив частот появления форм в режиме демонстрационных данных.
    this.demoMode.shapeQuota!.push(1);

    return this._getVertices.length - 1;
  }

  /**
   * Устанавливает необходимые перед запуском рендера параметры экземпляра и WebGL.
   *
   * @public
   * @param {SPlotOptions} options Пользовательские настройки экземпляра.
   */
  setup(options: SPlotOptions) {

    // Применение пользовательских настроек.
    this._setOptions(options);

    this._createWebGl()

    // Обнуление счетчика полигонов.
    this._amountOfPolygons = 0;

    // Обнуление счетчиков форм полигонов.
    for (let i = 0; i < this._getVertices.length; i++) {
      this._buffers.amountOfShapes[i] = 0;
    }

    /**
     * Предельное количество вершин в группе полигонов зависит от параметра
     * circleApproxLevel, который мог быть изменен пользовательскими настройками.
     */
    this._maxAmountOfVertexPerPolygonGroup = 32768 - (this.circleApproxLevel + 1);

    // Инициализация вспомогательных констант.
    this._setUsefulConstants();

    /**
     * Подготовка кодов шейдеров. Код фрагментного шейдера используется как есть.
     * В код вершинного шейдера вставляется код выбора цвета вершин.
     */
    let vertexShaderCode = this._vertexShaderCodeTemplate.replace(
      'SET-VERTEX-COLOR-CODE',
      this._genShaderColorCode()
    );
    let fragmentShaderCode = this._fragmentShaderCodeTemplate;

    // Создание шейдеров WebGL.
    let vertexShader = this._createWebGlShader('VERTEX_SHADER', vertexShaderCode);
    let fragmentShader = this._createWebGlShader('FRAGMENT_SHADER', fragmentShaderCode);

    // Создание программы WebGL.
    let gpuProgram = this._createWebGlProgram(vertexShader, fragmentShader);
    this._setWebGlProgram(gpuProgram);

    // Установка связей переменных приложения с программой WebGl.
    this._setWebGlVariable('attribute', 'a_position');
    this._setWebGlVariable('attribute', 'a_color');
    this._setWebGlVariable('uniform', 'u_matrix');

    // Создание и заполнение данными буферов WebGL.
    this._createWbGlBuffers();

    // Установка цвета очистки рендеринга
    let [r, g, b] = this._convertColor(this.bgColor);
    this._gl.clearColor(r, g, b, 0.0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    // Если требуется - рендеринг запускается сразу после установки параметров экземпляра.
    if (this.forceRun) {
      this.run();
    }
  }

  /**
   * Применяет пользовательские настройки экземпляра.
   *
   * @private
   * @param {SPlotOtions} options Пользовательские настройки экземпляра.
   */
  _setOptions(options: SPlotOptions) {

    /**
     * Копирование пользовательских настроек в соответсвующие поля экземпляра.
     * Копируются только те пользовательские настройки, которым имеются соответствующие
     * эквиваленты в полях экземпляра. Копируется также первый уровень вложенных
     * настроек.
     */
    for (let option in options) {

      if (!this.hasOwnProperty(option)) continue

      if (isObject((options as any)[option]) && isObject((this as any)[option]) ) {
        for (let nestedOption in (options as any)[option]) {
          if ((this as any)[option].hasOwnProperty(nestedOption)) {
            (this as any)[option][nestedOption] = (options as any)[option][nestedOption];
          }
        }
      } else {
        (this as any)[option] = (options as any)[option];
      }
    }

    /**
     * Если пользователь задает размер плоскости, но при этом на задает начальное
     * положение области просмотра, то область просмотра помещается в центр заданной
     * плоскости.
     */
    if (options.hasOwnProperty('gridSize') && !options.hasOwnProperty('camera')) {
      this.camera = {
        x: this.gridSize.width / 2,
        y: this.gridSize.height / 2,
        zoom: 1
      };
    }

    /**
     * Если запрошен режим демонстрационных данных, то для итерирования объектов
     * будет использоваться внутренний метод, имитирующий итерирование. При этом,
     * если была задана внешняя функция итерирования - она будет проигнорирована.
     */
    if (this.demoMode.isEnable) {
      this.iterationCallback = this._demoIterationCallback;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      this._reportMainInfo(options);
    }
  }

  /**
   * Вычисляет набор вспомогательных констант _USEFUL_CONSTS[].
   * Они хранят результаты алгебраических и тригонометрических вычислений,
   * используемых в расчетах вершин полигонов и матриц трансформации. Такие константы
   * позволяют вынести затратные для процессора операции за пределы многократно
   * используемых функций увеличивая производительность приложения на этапах
   * подготовки данных и рендеринга.
   *
   * @private
   */
  _setUsefulConstants() {

    // Константы, зависящие от размера полигона.
    this._USEFUL_CONSTS[0] = this.polygonSize / 2;
    this._USEFUL_CONSTS[1] = this._USEFUL_CONSTS[0] / Math.cos(Math.PI / 6);
    this._USEFUL_CONSTS[2] = this._USEFUL_CONSTS[0] * Math.tan(Math.PI / 6);

    // Константы, зависящие от степени детализации круга и размера полигона.
    this._USEFUL_CONSTS[3] = new Float32Array(this.circleApproxLevel);
    this._USEFUL_CONSTS[4] = new Float32Array(this.circleApproxLevel);

    for (let i = 0; i < this.circleApproxLevel; i++) {
      const angle = 2 * Math.PI * i / this.circleApproxLevel;
      this._USEFUL_CONSTS[3][i] = this._USEFUL_CONSTS[0] * Math.cos(angle);
      this._USEFUL_CONSTS[4][i] = this._USEFUL_CONSTS[0] * Math.sin(angle);
    }

    // Константы, зависящие от размера канваса.
    this._USEFUL_CONSTS[5] = 2 / this._canvas.width;
    this._USEFUL_CONSTS[6] = 2 / this._canvas.height;
    this._USEFUL_CONSTS[7] = 2 / this._canvas.clientWidth;
    this._USEFUL_CONSTS[8] = -2 / this._canvas.clientHeight;
    this._USEFUL_CONSTS[9] = this._canvas.getBoundingClientRect().left;
    this._USEFUL_CONSTS[10] = this._canvas.getBoundingClientRect().top;
  }

  _createWebGlShader(shaderType: WebGlShaderType, shaderCode: string) {

    // Создание, привязка кода и компиляция шейдера.
    const shader = this._gl.createShader(this._gl[shaderType]) as WebGLShader;
    this._gl.shaderSource(shader, shaderCode);
    this._gl.compileShader(shader);

    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this._gl.getShaderInfoLog(shader));
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.group('%cСоздан шейдер [' + shaderType + ']', this._debugStyle);
      console.log(shaderCode);
      console.groupEnd();
    }

    return shader;
  }

  /**
   * Создает программу WebGL.
   *
   * @private
   * @param {WebGLShader} vertexShader Вершинный шейдер.
   * @param {WebGLShader} fragmentShader Фрагментный шейдер.
   * @return {WebGLProgram} Созданный объект программы WebGL.
   */
  _createWebGlProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {

    // Создание я привязка программы WebGL.
    let gpuProgram = this._gl.createProgram() as WebGLProgram;
    this._gl.attachShader(gpuProgram, vertexShader);
    this._gl.attachShader(gpuProgram, fragmentShader);
    this._gl.linkProgram(gpuProgram);

    if (!this._gl.getProgramParameter(gpuProgram, this._gl.LINK_STATUS)) {
      throw new Error('Ошибка создания программы WebGL. ' + this._gl.getProgramInfoLog(gpuProgram));
    }

    return gpuProgram;
  }

  _setWebGlProgram(gpuProgram: WebGLProgram) {
    this._gl.useProgram(gpuProgram);
    this._gpuProgram = gpuProgram;
  }

  _setWebGlVariable(varType: WebGlVariableType, varName: string) {
    if (varType === 'uniform') {
      this._variables[varName] = this._gl.getUniformLocation(this._gpuProgram, varName);
    } else if (varType === 'attribute') {
      this._variables[varName] = this._gl.getAttribLocation(this._gpuProgram, varName);
    }
  }

  /**
   * Создает и заполняет данными обо всех полигонах буферы WebGL.
   *
   * @private
   */
  _createWbGlBuffers() {

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {

      console.log('%cЗапущен процесс загрузки данных [' +
        this._getCurrentTime() + ']...', this._debugStyle);

      /**
       * Запуск консольного таймера, подсчитывающего длительность процесса итерирования
       * исходных объектов и загрузки соответствующих данных в видеопамять.
       */
      console.time('Длительность');
    }

    /** @type {SPlotPolygonGroup} */
    let polygonGroup;

    // Итерирование групп полигонов.
    while (polygonGroup = this._createPolygonGroup()) {

      // Создание и заполнение буферов данными о группе полигонов.

      this._addWbGlBuffer(this._buffers.vertexBuffers, 'ARRAY_BUFFER',
        new Float32Array(polygonGroup.vertices), 0);

      this._addWbGlBuffer(this._buffers.colorBuffers, 'ARRAY_BUFFER',
        new Uint8Array(polygonGroup.colors), 1);

      this._addWbGlBuffer(this._buffers.indexBuffers, 'ELEMENT_ARRAY_BUFFER',
        new Uint16Array(polygonGroup.indices), 2);

      // Счетчик количества буферов.
      this._buffers.amountOfBufferGroups++;

      // Определение количества вершин GL-треугольников текущей группы буферов.
      this._buffers.amountOfGLVertices.push(polygonGroup.amountOfGLVertices);

      // Определение общего количества вершин GL-треугольников.
      this._buffers.amountOfTotalGLVertices += polygonGroup.amountOfGLVertices;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      this._reportAboutObjectReading();
    }
  }

  /**
   * Считывает данные об исходных объектах и формирует соответсвующую этим объектам
   * группу полигонов. Группа формируется с учетом лимита на количество вершин
   * в группе и лимита на общее количество полигонов на канвасе.
   *
   * @private
   * @return {(SPlotPolygonGroup|null)} Созданная группа полигонов или null,
   *     если формирование всех групп полигонов завершилось.
   */
  _createPolygonGroup() {

    /** @type {SPlotPolygonGroup} */
    let polygonGroup = {
      vertices: [],
      indices: [],
      colors: [],
      amountOfVertices: 0,
      amountOfGLVertices: 0
    }

    /** @type {SPlotPolygon} */
    let polygon;

    /**
     * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая
     * обработка исходных объектов больше не требуется - формирование групп полигонов
     * завершается возвратом значения null (симуляция достижения последнего
     * обрабатываемого исходного объекта).
     */
    if (this._amountOfPolygons >= this.maxAmountOfPolygons) return null;

    // Итерирование исходных объектов.
    while (polygon = this.iterationCallback!()) {

      // Добавление в группу полигонов нового полигона.
      this._addPolygon(polygonGroup, polygon);

      // Подсчитывается число применений каждой из форм полигонов.
      this._buffers.amountOfShapes[polygon.shape]++;

      // Счетчик общего количество полигонов.
      this._amountOfPolygons++;

      /**
       * Если количество полигонов канваса достигло допустимого максимума, то дальнейшая
       * обработка исходных объектов больше не требуется - формирование групп полигонов
       * завершается возвратом значения null (симуляция достижения последнего
       * обрабатываемого исходного объекта).
       */
      if (this._amountOfPolygons >= this.maxAmountOfPolygons) break;

      /**
       * Если общее количество всех вершин в группе полигонов превысило допустимое,
       * то группа полигонов считается сформированной и итерирование исходных
       * объектов прерывается.
       */
      if (polygonGroup.amountOfVertices >= this._maxAmountOfVertexPerPolygonGroup) break;
    }

    // Подсчитывается общее количество вершин всех вершинных буферов.
    this._buffers.amountOfTotalVertices += polygonGroup.amountOfVertices;

    // Если группа полигонов непустая, то возвращаем ее. Если пустая - возвращаем null.
    return (polygonGroup.amountOfVertices > 0) ? polygonGroup : null;
  }

  /**
   * Создает в массиве буферов WebGL новый буфер и записывает в него переданные данные.
   *
   * @private
   * @param {Array.<WebGLBuffer>} buffers Массив буферов WebGL, в который будет
   *     добавлен создаваемый буфер.
   * @param {string="ARRAY_BUFFER","ELEMENT_ARRAY_BUFFER"} type Тип создаваемого
   *     буфера - с информацией о вершинах, или с информацией об индексах вершин.
   * @param {TypedArray} data Данные в виде типизированного массива для записи
   *     в создаваемый буфер.
   * @param {number} key Ключ (индекс), идентифицирующий тип буфера (для вершин,
   *     для цветов, для индексов). Используется для раздельного подсчета памяти,
   *     занимаемой каждым типом буфера.
   */
  _addWbGlBuffer(buffers: WebGLBuffer[], type: WebGlBufferType, data: TypedArray, key: number) {

    // Определение индекса нового элемента в массиве буферов WebGL.
    const index = this._buffers.amountOfBufferGroups;

    // Создание и заполнение данными нового буфера.
    buffers[index] = this._gl.createBuffer()!;
    this._gl.bindBuffer(this._gl[type], buffers[index]);
    this._gl.bufferData(this._gl[type], data, this._gl.STATIC_DRAW);

    // Подсчет памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
    this._buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT;
  }

  _getVerticesOfTriangle(x: number, y: number, consts: any[]): SPlotPolygonVertices {

    const [x1, y1] = [x - consts[0], y + consts[2]];
    const [x2, y2] = [x, y - consts[1]];
    const [x3, y3] = [x + consts[0], y + consts[2]];

    const vertices = {
      values: [x1, y1, x2, y2, x3, y3],
      indices: [0, 1, 2]
    }

    return vertices;
  }

  _getVerticesOfSquare(x: number, y: number, consts: any[]): SPlotPolygonVertices {

    const [x1, y1] = [x - consts[0], y - consts[0]];
    const [x2, y2] = [x + consts[0], y + consts[0]];

    const vertices = {
      values: [x1, y1, x2, y1, x2, y2, x1, y2],
      indices: [0, 1, 2, 0, 2, 3]
    };

    return vertices;
  }

  _getVerticesOfCircle(x: number, y: number, consts: any[]): SPlotPolygonVertices {

    // Занесение в набор вершин центра круга.
    const vertices: SPlotPolygonVertices = {
      values: [x, y],
      indices: []
    };

    // Добавление апроксимирующих окружность круга вершин.
    for (let i = 0; i < consts[3].length; i++) {
      vertices.values.push(x + consts[3][i], y + consts[4][i]);
      vertices.indices.push(0, i + 1, i + 2);
    }

    /**
     * Последняя вершина последнего GL-треугольника заменяется на первую апроксимирующую
     * окружность круга вершину, замыкая апроксимирущий круг полигон.
     */
    vertices.indices[vertices.indices.length - 1] = 1;

    return vertices;
  }

  /**
   * Создает и добавляет в группу полигонов новый полигон.
   *
   * @private
   * @param {SPlotPolygonGroup} polygonGroup Группа полигонов, в которую
   *     происходит добавление.
   * @param {SPlotPolygon} polygon Информация о добавляемом полигоне.
   */
  _addPolygon(polygonGroup: SPlotPolygonGroup, polygon: SPlotPolygon) {

    /**
     * На основе формы полигона и координат его центра вызывается соответсвующая
     * функция нахождения координат его вершин.
     */
    const vertices = this._getVertices[polygon.shape].func(
      polygon.x, polygon.y, this._USEFUL_CONSTS
    );

    // Количество вершин - это количество пар чисел в массиве вершин.
    const amountOfVertices = Math.trunc(vertices.values.length / 2);

    // Нахождение индекса первой добавляемой в группу полигонов вершины.
    const indexOfLastVertex = polygonGroup.amountOfVertices;

    /**
     * Номера индексов вершин - относительные. Для вычисления абсолютных индексов
     * необходимо прибавить к относительным индексам индекс первой добавляемой
     * в группу полигонов вершины.
     */
    for (let i = 0; i < vertices.indices.length; i++) {
      vertices.indices[i] += indexOfLastVertex;
    }

    /**
     * Добавление в группу полигонов индексов вершин нового полигона и подсчет
     * общего количества вершин GL-треугольников в группе.
     */
    polygonGroup.indices.push(...vertices.indices);
    polygonGroup.amountOfGLVertices += vertices.indices.length;

    /**
     * Добавление в группу полигонов самих вершин нового полигона и подсчет
     * общего количества вершин в группе.
     */
    polygonGroup.vertices.push(...vertices.values);
    polygonGroup.amountOfVertices += amountOfVertices;

    // Добавление цветов вершин - по одному цвету на каждую вершину.
    for (let i = 0; i < amountOfVertices; i++) {
      polygonGroup.colors.push(polygon.color);
    }
  }

  /**
   * Выводит в консоль базовую часть отладочной информации.
   *
   * @private
   * @param {SPlotOtions} options Пользовательские настройки экземпляра.
   */
  _reportMainInfo(options: SPlotOptions) {

    console.log('%cВключен режим отладки ' + this.constructor.name +
      ' [#' + this._canvas.id + ']', this._debugStyle + ' background-color: #cc0000;');

    if (this.demoMode.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this._debugStyle);
    }

    // Группа "Предупреждение".
    console.group('%cПредупреждение', this._debugStyle);

    console.dir('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90');

    console.groupEnd();
/*
    // Группа "Видеосистема".
    console.group('%cВидеосистема', this._debugStyle);

    let ext = this._gl.getExtension('WEBGL_debug_renderer_info');
    let graphicsCardName = (ext) ? this._gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]'
    console.log('Графическая карта: ' + graphicsCardName);
    console.log('Версия GL: ' + this._gl.getParameter(this._gl.VERSION));

    console.groupEnd();
*/
    // Группа "Настройка параметров экземпляра".
    console.group('%cНастройка параметров экземпляра', this._debugStyle);

    console.dir(this);
    console.log('Заданы параметры:\n', JSON.stringify(options, null, ' '));
    console.log('Канвас: #' + this._canvas.id);
    console.log('Размер канваса: ' + this._canvas.width + ' x ' + this._canvas.height + ' px');
    console.log('Размер плоскости: ' + this.gridSize.width + ' x ' + this.gridSize.height + ' px');
    console.log('Размер полигона: ' + this.polygonSize + ' px');
    console.log('Апроксимация окружности: ' + this.circleApproxLevel + ' углов');
    console.log('Функция перебора: ' + this.iterationCallback!.name);

    console.groupEnd();
  }

  /**
   * Выводит в консоль отладочную информацию о загрузке исходных объектов.
   *
   * @private
   */
  _reportAboutObjectReading() {

    // Группа "Загрузка данных завершена".
    console.group('%cЗагрузка данных завершена [' +
      this._getCurrentTime() + ']', this._debugStyle);

    console.timeEnd('Длительность');

    console.log('Результат: ' +
      ((this._amountOfPolygons >= this.maxAmountOfPolygons) ? 'достигнут заданный лимит (' +
        this.maxAmountOfPolygons.toLocaleString() + ')' : 'обработаны все объекты'));

    // Группа "Кол-во объектов".
    console.group('Кол-во объектов: ' + this._amountOfPolygons.toLocaleString());

    for (let i = 0; i < this._getVertices.length; i++) {
      const shapeCapction = this._getVertices[i].caption;
      const shapeAmount = this._buffers.amountOfShapes[i];
      console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
        ' [~' + Math.round(100 * shapeAmount / this._amountOfPolygons) + '%]');
    }

    console.log('Палитра: ' + this.polygonPalette.length + ' цветов');

    console.groupEnd();

    let bytesUsedByBuffers = this._buffers.sizeInBytes[0] +
      this._buffers.sizeInBytes[1] + this._buffers.sizeInBytes[2];

    // Группа "Занято видеопамяти".
    console.group('Занято видеопамяти: ' +
      (bytesUsedByBuffers / 1000000).toFixed(2).toLocaleString() + ' МБ');

    console.log('Буферы вершин: ' +
      (this._buffers.sizeInBytes[0] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * this._buffers.sizeInBytes[0] / bytesUsedByBuffers) + '%]');

    console.log('Буферы цветов: '
      + (this._buffers.sizeInBytes[1] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * this._buffers.sizeInBytes[1] / bytesUsedByBuffers) + '%]');

    console.log('Буферы индексов: '
      + (this._buffers.sizeInBytes[2] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * this._buffers.sizeInBytes[2] / bytesUsedByBuffers) + '%]');

    console.groupEnd();

    console.log('Кол-во групп буферов: ' +
      this._buffers.amountOfBufferGroups.toLocaleString());

    console.log('Кол-во GL-треугольников: ' +
      (this._buffers.amountOfTotalGLVertices / 3).toLocaleString());

    console.log('Кол-во вершин: ' +
      this._buffers.amountOfTotalVertices.toLocaleString());

    console.groupEnd();
  }

  /**
   * Создает дополнение к коду на языке GLSL. Созданный код будет встроен в код
   * вершинного шейдера WebGL для задания цвета вершины в зависимости от индекса
   * цвета, присвоенного этой вершине. Т.к. шейдер не позволяет использовать в
   * качестве индексов переменные - для задания цвета используется перебор индексов.
   *
   * @private
   * @return {string} Код на языке GLSL.
   */
  _genShaderColorCode() {

    // Временно добавляем в палитру цветов вершин цвет для направляющих.
    this.polygonPalette.push(this.rulesColor);

    let code = '';

    for (let i = 0; i < this.polygonPalette.length; i++) {

      // Получение цвета в нужном формате.
      let [r, g, b] = this._convertColor(this.polygonPalette[i]);

      // Формировние строк GLSL-кода проверки индекса цвета.
      code += ((i === 0) ? '' : '  else ') +
        'if (a_color == ' + i + '.0) v_color = vec3(' +
        r.toString().slice(0, 9) + ',' +
        g.toString().slice(0, 9) + ',' +
        b.toString().slice(0, 9) + ');\n';
    }

    // Удаляем из палитры вершин временно добавленный цвет направляющих.
    this.polygonPalette.pop();

    return code;
  }

  _convertColor(hexColor: HEXColor) {

    let k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    let [r, g, b] = [parseInt(k![1], 16) / 255, parseInt(k![2], 16) / 255, parseInt(k![3], 16) / 255];

    return [r, g, b];
  }

  /**
   * Вычисляет текущее время.
   *
   * @private
   * @retutn {string} Строковая форматированная запись текущего времени.
   */
  _getCurrentTime() {

    let today = new Date();

    let time =
      ((today.getHours() < 10 ? '0' : '') + today.getHours()) + ":" +
      ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) + ":" +
      ((today.getSeconds() < 10 ? '0' : '') + today.getSeconds());

    return time;
  }

  /**
   * Создает и добавляет в группу полигонов новый полигон - квадрат.
   *
   * @private
   * @param {HTMLCanvasElement} canvas Объект-канвас необходим, чтобы метод имел
   *     возможность обращаться к матрице трансформации экземпляра независимо от
   *     того, из какого места был вызван метод. Существует два варианта вызова
   *     метода - из другого метода экземпляра (render) и из обработчика события
   *     мыши (_handleMouseWheel). Во втором варианте использование объекта this
   *     невозможно.
   */
  _updateTransMatrix($this: SPlot) {

    const t1 = $this.camera.zoom * $this._USEFUL_CONSTS[5];
    const t2 = $this.camera.zoom * $this._USEFUL_CONSTS[6];

    $this._transormation.matrix = [
      t1, 0, 0, 0, -t2, 0, -$this.camera.x * t1 - 1, $this.camera.y * t2 + 1, 1
    ];
  }

  /**
   * Реагирует на движение мыши/трекпада в момент, когда ее клавиша удерживается
   * нажатой. В этот момент область видимости перемещается на плоскости вместе
   * с движением мыши/трекпада. Вычисления внутри события сделаны максимально
   * производительными в ущерб читабельности логики производимых действий.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseMove(event: MouseEvent) {

    // Хак получения доступа к объекту this.
    const $this = SPlot.instances[ (event.target as HTMLElement).id ]

    $this.camera.x = $this._transormation.startCameraX + $this._transormation.startPosX -
      ((event.clientX - $this._USEFUL_CONSTS[9]) * $this._USEFUL_CONSTS[7] - 1) * $this._transormation.startInvMatrix[0] -
      $this._transormation.startInvMatrix[6];

    $this.camera.y = $this._transormation.startCameraY + $this._transormation.startPosY -
      ((event.clientY - $this._USEFUL_CONSTS[10]) * $this._USEFUL_CONSTS[8] + 1) * $this._transormation.startInvMatrix[4] -
      $this._transormation.startInvMatrix[7];

    // Рендеринг с новыми параметрами области видимости.
    $this._render();
  }

  /**
   * Реагирует на нажатие клавиши мыши/трекпада. В этот момент запускается анализ
   * движения мыши/трекпада (с зажатой клавишей). Вычисления внутри события сделаны
   * максимально производительными в ущерб читабельности логики производимых действий.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseDown(event: MouseEvent) {

    event.preventDefault();

    // Хак получения доступа к объекту this.
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    event.target!.addEventListener('mousemove', $this._handleMouseMove as EventListener);
    event.target!.addEventListener('mouseup', $this._handleMouseUp as EventListener);

    $this._transormation.startInvMatrix = [
      1 / $this._transormation.matrix[0], 0, 0, 0, 1 / $this._transormation.matrix[4],
      0, -$this._transormation.matrix[6] / $this._transormation.matrix[0],
      -$this._transormation.matrix[7] / $this._transormation.matrix[4], 1
    ];

    $this._transormation.startCameraX = $this.camera.x;
    $this._transormation.startCameraY = $this.camera.y;

    $this._transormation.startPosX =
      ((event.clientX - $this._USEFUL_CONSTS[9]) * $this._USEFUL_CONSTS[7] - 1) *
      $this._transormation.startInvMatrix[0] + $this._transormation.startInvMatrix[6];

    $this._transormation.startPosY =
      ((event.clientY - $this._USEFUL_CONSTS[10]) * $this._USEFUL_CONSTS[8] + 1) *
      $this._transormation.startInvMatrix[4] + $this._transormation.startInvMatrix[7]
  }

  /**
   * Реагирует на отжатие клавиши мыши/трекпада. В этот момент анализ движения
   * мыши/трекпада с зажатой клавишей прекращается.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseUp(event: MouseEvent) {

    // Хак получения доступа к объекту this.
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    event.target!.removeEventListener('mousemove', $this._handleMouseMove as EventListener);
    event.target!.removeEventListener('mouseup', $this._handleMouseUp as EventListener);
  }

  /**
   * Реагирует на зумирование мыши/трекпада. В этот момент происходит зумирование
   * координатной плоскости. Вычисления внутри события сделаны максимально
   * производительными в ущерб читабельности логики производимых действий.
   *
   * @private
   * @param {MouseEvent} event Событие мыши/трекпада.
   */
  _handleMouseWheel(event: WheelEvent) {

    event.preventDefault();

    // Хак получения доступа к объекту this.
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    const clipX = (event.clientX - $this._USEFUL_CONSTS[9]) * $this._USEFUL_CONSTS[7] - 1;
    const clipY = (event.clientY - $this._USEFUL_CONSTS[10]) * $this._USEFUL_CONSTS[8] + 1;

    const preZoomX = (clipX - $this._transormation.matrix[6]) / $this._transormation.matrix[0];
    const preZoomY = (clipY - $this._transormation.matrix[7]) / $this._transormation.matrix[4];

    const newZoom = $this.camera.zoom * Math.pow(2, event.deltaY * -0.01);
    $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));

    $this._updateTransMatrix($this);

    const postZoomX = (clipX - $this._transormation.matrix[6]) / $this._transormation.matrix[0];
    const postZoomY = (clipY - $this._transormation.matrix[7]) / $this._transormation.matrix[4];

    $this.camera.x += (preZoomX - postZoomX);
    $this.camera.y += (preZoomY - postZoomY);

    // Рендеринг с новыми параметрами области видимости.
    $this._render();
  }

  /**
   * Рисует плоскость в соответствии с текущими параметрами области видимости.
   *
   * @private
   */
  _render() {

    // Очистка объекта рендеринга WebGL.
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    // Обновление матрицы трансформации.
    this._updateTransMatrix(this);

    // Привязка матрицы трансформации к переменной шейдера.
    this._gl.uniformMatrix3fv(this._variables['u_matrix'], false, this._transormation.matrix);

    // Итерирование и рендеринг всех буферов WebGL.
    for (let i = 0; i < this._buffers.amountOfBufferGroups; i++) {

      // Установка текущего буфера вершин и его привязка к переменной шейдера.
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.vertexBuffers[i]);
      this._gl.enableVertexAttribArray(this._variables['a_position']);
      this._gl.vertexAttribPointer(this._variables['a_position'],
        2, this._gl.FLOAT, false, 0, 0);

      // Установка текущего буфера цветов вершин и его привязка к переменной шейдера.
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.colorBuffers[i]);
      this._gl.enableVertexAttribArray(this._variables['a_color']);
      this._gl.vertexAttribPointer(this._variables['a_color'],
        1, this._gl.UNSIGNED_BYTE, false, 0, 0);

      // Установка текущего буфера индексов вершин.
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffers[i]);

      // Отрисовка текущих буферов.
      this._gl.drawElements(this._gl.TRIANGLES, this._buffers.amountOfGLVertices[i],
        this._gl.UNSIGNED_SHORT, 0);
    }
  }

  /**
   * Генерирует случайное целое число в диапазоне от 0 до заданного предела. Сам
   * предел в диапазон не входит: [0...range-1].
   *
   * @private
   * @param {number} range Верхний предел диапазона случайного выбора.
   * @return {number} Сгенерированное случайное число.
   */
  _randomInt(range: number) {
    return Math.floor(Math.random() * range);
  }

  /**
   * Случайным образом возвращает один из индексов числового одномерного массива.
   * Несмотря на случайность каждого конкретного вызова функции, индексы возвращаются
   * с предопределенной частотой. Частота "выпаданий" индексов задается соответствующими
   * значениями элементов. Пример: На массиве [3, 2, 5] функция будет возвращать
   * индекс 0 с частотой = 3/(3+2+5) = 3/10, индекс 1 с частотой = 2/(3+2+5) = 2/10,
   * индекс 2 с частотой = 5/(3+2+5) = 5/10.
   * @private
   * @param {Array.<number>} arr Числовой одномерный массив, индексы которого будут
   *     возвращаться с предопределенной частотой.
   * @return {number} Случайный индекс из массива arr.
   */
  _randomQuotaIndex(arr: number[]) {

    let a = [];
    a[0] = arr[0];

    for (let i = 1; i < arr.length; i++) {
      a[i] = a[i - 1] + arr[i];
    }

    const lastIndex = a.length - 1;

    let r = Math.floor((Math.random() * a[lastIndex])) + 1;
    let [l, h] = [0, lastIndex];

    while (l < h) {
      const m = l + ((h - l) >> 1);
      (r > a[m]) ? (l = m + 1) : (h = m);
    }

    return (a[l] >= r) ? l : -1;
  }

  /**
   * Имитирует итерирование исходных объектов. При каждом новом вызове возвращает
   * информацию о полигоне со случаным положением, случайной формой и случайным цветом.
   *
   * @private
   * @return {(SPlotPolygon|null)} Информация о полигоне или null, если перебор
   *     исходных объектов закончился.
   */
  _demoIterationCallback() {
    if (this.demoMode.index! < this.demoMode.amount!) {
      this.demoMode.index! ++;
      return {
        x: this._randomInt(this.gridSize.width),
        y: this._randomInt(this.gridSize.height),
        shape: this._randomQuotaIndex(this.demoMode.shapeQuota!),
        color: this._randomInt(this.polygonPalette.length)
      }
    }
    else
      return null;
  }

  /**
   * Запускает рендеринг и "прослушку" событий мыши на канвасе.
   *
   * @public
   */
  run() {
    if (!this._isRunning) {

      this._canvas.addEventListener('mousedown', this._handleMouseDown);
      this._canvas.addEventListener('wheel', this._handleMouseWheel);

      this._render();

      this._isRunning = true;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cРендеринг запущен', this._debugStyle);
    }
  }

  /**
   * Останавливает рендеринг и "прослушку" событий мыши на канвасе.
   *
   * @public
   * @param {boolean} clear Признак неообходимости вместе с остановкой рендеринга
   *     очистить канвас. Значение true очищает канвас, значение false - не очищает.
   *     По умолчанию очистка не происходит.
   */
  stop(clear = false) {

    if (this._isRunning) {

      this._canvas.removeEventListener('mousedown', this._handleMouseDown);
      this._canvas.removeEventListener('wheel', this._handleMouseWheel);
      this._canvas.removeEventListener('mousemove', this._handleMouseMove);
      this._canvas.removeEventListener('mouseup', this._handleMouseUp);

      if (clear) {
        this.clear();
      }

      this._isRunning = false;
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cРендеринг остановлен', this._debugStyle);
    }
  }

  /**
   * Очищает канвас, закрашивая его в фоновый цвет.
   *
   * @public
   */
  clear() {

    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cКонтекст рендеринга очищен [' + this.bgColor + ']', this._debugStyle);
    }
  }
}
