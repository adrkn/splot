/**
 * Размер точки влияет на производительность - когда много перекрытий - начинаются тормоза, даже если объектов немного.
 * Надо придумать способ не отображать объекты, если область видимости уже не имеет свободного места.
 *
 * Надо убрать массивы индексов и формы.
 *
 */




// @ts-ignore
import m3 from './m3'

/**
 * Проверяет является ли переменная экземпляром какого-либоо класса.
 *
 * @param val - Проверяемая переменная.
 * @returns Результат проверки.
 */
function isObject(obj: any): boolean {
  return (Object.prototype.toString.call(obj) === '[object Object]')
}

/**
 * Возвращает случайное целое число в диапазоне: [0...range-1].
 *
 * @param range - Верхний предел диапазона случайного выбора.
 * @returns Случайное число.
 */
function randomInt(range: number): number {
  return Math.floor(Math.random() * range)
}

/**
 * Преобразует объект в строку JSON. Имеет отличие от стандартной функции JSON.stringify - поля объекта, имеющие
 * значения функций не пропускаются, а преобразуются в название функции.
 *
 * @param obj - Целевой объект.
 * @returns Строка JSON, отображающая объект.
 */
function jsonStringify(obj: any): string {
  return JSON.stringify(
    obj,
    function (key, value) {
      return (typeof value === 'function') ? value.name : value
    },
    ' '
  )
}

/**
 * Тип функции, вычисляющей координаты вершин полигона определенной формы.
 *
 * @param x - Положение центра полигона на оси абсцисс.
 * @param y - Положение центра полигона на оси ординат.
 * @param consts - Набор вспомогательных констант, используемых для вычисления вершин.
 * @returns Данные о вершинах полигона.
 */
type SPlotCalcShapeFunc = (x: number, y: number, consts: Array<any>) => SPlotPolygonVertices

/**
 * Тип цвета в HEX-формате ("#ffffff").
 */
type HEXColor = string

/**
 * Тип функции итерирования массива исходных объектов. Каждый вызов такой функции должен возвращать информацию об
 * очередном полигоне, который необходимо отобразить (его координаты, форму и цвет). Когда исходные объекты закончатся
 * функция должна вернуть null.
 */
type SPlotIterationFunction = () => SPlotPolygon | null

/**
 * Тип места вывода системной информации при активированном режиме отладки приложения.
 * Значение "console" устанавливает в качестве места вывода консоль браузера.
 *
 * @todo Добавить место вывода - HTML документ (значение "document")
 * @todo Добавить место вывода - файл (значение "file")
 */
type SPlotDebugOutput = 'console'

/**
 * Тип шейдера WebGL.
 * Значение "VERTEX_SHADER" задает вершинный шейдер.
 * Значение "FRAGMENT_SHADER" задает фрагментный шейдер.
 */
type WebGlShaderType = 'VERTEX_SHADER' | 'FRAGMENT_SHADER'

/**
 * Тип буфера WebGL.
 * Значение "ARRAY_BUFFER" задает буфер содержащий вершинные атрибуты.
 * Значение "ELEMENT_ARRAY_BUFFER" задает буфер использующийся для индексирования элементов.
 */
type WebGlBufferType = 'ARRAY_BUFFER' | 'ELEMENT_ARRAY_BUFFER'

/**
 * Тип переменной WebGL.
 * Значение "uniform" задает общую для всех вершинных шейдеров переменную.
 * Значение "attribute" задает уникальную переменную для каждого вершинного шейдера.
 * Значение "varying" задает уникальную переменную с общей областью видимости для вершинного и фрагментного шейдеров.
 */
type WebGlVariableType = 'uniform' | 'attribute' | 'varying'

/**
 * Тип массива данных, занимающих в памяти непрерывный объем.
 */
type TypedArray = Int8Array | Int16Array | Int32Array | Uint8Array |
  Uint16Array | Uint32Array | Float32Array | Float64Array

/**
 * Тип для настроек приложения.
 *
 * @param iterationCallback - Функция итерирования исходных объектов.
 * @param polygonPalette - Цветовая палитра полигонов.
 * @param gridSize - Размер координатной плоскости в пикселях.
 * @param polygonSize - Размер полигона на графике в пикселях (сторона для квадрата, диаметр для круга и т.п.)
 * @param circleApproxLevel - Степень детализации круга - количество углов полигона, апроксимирующего окружность круга.
 * @param debugMode - Параметры режима отладки приложения.
 * @param demoMode - Параметры режима использования демонстрационных данных.
 * @param forceRun - Признак того, что рендеринг необходимо начать сразу после задания настроек экземпляра (по умолчанию
 *     рендеринг запускается только после вызова метода start).
 * @param maxAmountOfPolygons - Искусственное ограничение количества отображаемых полигонов. При достижении этого числа
 *     итерирование исходных объектов прерывается, даже если обработаны не все объекты.
 * @param bgColor - Фоновый цвет канваса.
 * @param rulesColor - Цвет направляющих.
 * @param camera - Положение координатной плоскости в области просмотра.
 * @param webGlSettings - Инициализирующие настройки контекста рендеринга WebGL.
 */
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

/**
 * Тип для информации о полигоне. Содержит данные, необходимые для добавления полигона в группу полигонов. Полигон - это
 * сплошная фигура на координатной плоскости, однозначно представляющая один исходный объект.
 *
 * @param x - Координата центра полигона на оси абсцисс. Может быть как целым, так и вещественным числом.
 * @param y - Координата центра полигона на оси ординат. Может быть как целым, так и вещественным числом.
 * @param shape - Форма полигона. Форма - это индекс в массиве форм {@link shapes}. Основные формы: 0 - треугольник, 1 -
 *     квадрат, 2 - круг.
 * @param color - Цвет полигона. Цвет - это индекс в диапазоне от 0 до 255, представляющий собой индекс цвета в
 *     предопределенном массиве цветов {@link polygonPalette}.
 */
interface SPlotPolygon {
  x: number,
  y: number,
  shape: number,
  color: number
}

/**
 * Тип для размера координатной плоскости.
 *
 * @param width - Ширина координатной плоскости в пикселях.
 * @param height - Высота координатноой плоскости в пикселях.
 */
interface SPlotGridSize {
  width: number,
  height: number
}

/**
 * Тип для параметров режима отладки.
 *
 * @param isEnable - Признак включения отладочного режима.
 * @param output - Место вывода отладочной информации.
 * @param headerStyle - Стиль для заголовка всего отладочного блока.
 * @param groupStyle - Стиль для заголовка группировки отладочных данных.
 */
interface SPlotDebugMode {
  isEnable?: boolean,
  output?: SPlotDebugOutput,
  headerStyle?: string,
  groupStyle?: string
}

/**
 * Тип для параметров режима отображения демонстрационных данных.
 *
 * @param isEnable - Признак включения демо-режима. В этом режиме приложение вместо внешней функции итерирования
 *     исходных объектов использует внутренний метод, имитирующий итерирование.
 * @param amount - Количество имитируемых исходных объектов.
 * @param shapeQuota - Частота появления в итерировании различных форм полигонов - треугольников[0], квадратов[1],
 *     кругов[2] и т.д. Пример: массив [3, 2, 5] означает, что частота появления треугольников = 3/(3+2+5) = 3/10,
 *     частота появления квадратов = 2/(3+2+5) = 2/10, частота появления кругов = 5/(3+2+5) = 5/10.
 * @param index - Параметр используемый для имитации итерирования. Задания пользовательского значения не требует.
 */
interface SPlotDemoMode {
  isEnable?: boolean,
  amount?: number,
  shapeQuota?: number[],
  index?: number
}

/**
 * Тип для положения координатной плоскости в области просмотра.
 *
 * @param x - Координата графика на оси абсцисс.
 * @param y - Координата графика на оси ординат.
 * @param zoom - Степень "приближения" наблюдателя к графику (масштаб коодринатной плоскости в области просмотра).
 */
interface SPlotCamera {
  x?: number,
  y?: number,
  zoom?: number
}




/**
 * Тип для трансформации. Содержит всю техническую информацию, необходимую для рассчета текущего положения координатной
 * плоскости в области просмотра во время событий перемещения и зумирования канваса.
 *
 * @param viewProjectionMat - Основная матрица трансформации 3x3 в виде одномерного массива из 9 элементов.
 * @param startInvViewProjMat - Вспомогательная матрица трансформации.
 * @param startCameraX - Вспомогательная точка трансформации.
 * @param startCameraY - Вспомогательная точка трансформации.
 * @param startPosX - Вспомогательная точка трансформации.
 * @param startPosY - Вспомогательная точка трансформации.
 */
interface SPlotTransformation {
  viewProjectionMat: number[],
  startInvViewProjMat: number[],
  startCamera: SPlotCamera,
  startPos: number[],
  startClipPos: number[],
  startMousePos: number[]
}




/**
 * Тип для информации о буферах, формирующих данные для загрузки в видеопамять.
 *
 * @param vertexBuffers - Массив буферов с информацией о вершинах полигонов.
 * @param colorBuffers - Массив буферов с информацией о цветах вершин полигонов.
 * @param indexBuffers - Массив буферов с индексами вершин полигонов.
 * @param amountOfBufferGroups - Количество буферных групп в массиве. Все указанные выше массивы буферов содержат
 *     одинаковое количество буферов.
 * @param amountOfGLVertices - Количество вершин, образующих GL-треугольники каждого вершинного буфера.
 * @param amountOfShapes - Количество полигонов каждой формы (сколько треугольников, квадратов, кругов и т.д.).
 * @param amountOfTotalVertices - Общее количество вершин всех вершинных буферов (vertexBuffers).
 * @param amountOfTotalGLVertices - Общее количество вершин всех индексных буферов (indexBuffers).
 * @param sizeInBytes - Размеры буферов каждого типа (для вершин, для цветов, для индексов) в байтах.
 */
interface SPlotBuffers {
  vertexBuffers: WebGLBuffer[],
  colorBuffers: WebGLBuffer[],
  indexBuffers: WebGLBuffer[],
  amountOfBufferGroups: number,
  amountOfGLVertices: number[],
  amountOfShapes: number[],
  amountOfTotalVertices: number,
  amountOfTotalGLVertices: number,
  sizeInBytes: number[]
}

/**
 * Тип для информации о группе полигонов, которую можно отобразить на канвасе за один вызов функции {@link drawElements}.
 *
 * @param vertices - Массив вершин всех полигонов группы. Каждая вершина - это пара чисел (координаты вершины на
 *     плоскости). Координаты могут быть как целыми, так и вещественными числами.
 * @param indices - Массив индексов вершин полигонов группы. Каждый индекс - это номер вершины в массиве вершин. Индексы
 *     описывают все GL-треугольники, из которых состоят полигоны группы, т.о. каждая тройка индексов кодирует один
 *     GL-треугольник. Индексы - это целые числа в диапазоне от 0 до 65535, что накладывает ограничение на максимальное
 *     количество вершин, хранимых в группе полигонов (не более 32768 штук).
 * @param colors - Массив цветов вершин полигонов группы. Каждое число задает цвет одной вершины в массиве вершин. Чтобы
 *     полигон был сплошного однородного цвета необходимо чтобы все вершины полигона имели одинаковый цвет. Цвет - это
 *     целое число в диапазоне от 0 до 255, представляющее собой индекс цвета в предопределенном массиве цветов.
 * @param amountOfVertices - Количество всех вершин в группе полигонов.
 * @param amountOfGLVertices - Количество вершин всех GL-треугольников в группе полигонов.
 */
interface SPlotPolygonGroup {
  vertices: number[],
  indices: number[],
  colors: number[],
  amountOfVertices: number,
  amountOfGLVertices: number
}

/**
 * Тип для информации о вершинах полигона.
 *
 * @param vertices - Массив всех вершин полигона. Каждая вершина - это пара чисел (координаты вершины на
 *     плоскости). Координаты могут быть как целыми, так и вещественными числами.
 * @param indices - Массив индексов вершин полигона. Каждый индекс - это номер вершины в массиве вершин. Индексы
 *     описывают все GL-треугольники, из которых состоит полигон.
 */
interface SPlotPolygonVertices {
  values: number[],
  indices: number[]
}

export default class SPlot {

  /**
   * Массив класса, содержащий ссылки на все созданные экземпляры класса. Индексами массива выступают идентификаторы
   * канвасов экземпляров. Используется для доступа к полям и методам экземпляра из тела внешних обрабочиков событий
   * мыши/трекпада.
   */
  public static instances: { [key: string]: SPlot } = {}

  // Функция по умолчанию для итерирования объектов не задается.
  public iterationCallback: SPlotIterationFunction | undefined = undefined

  // Цветовая палитра полигонов по умолчанию.
  public polygonPalette: HEXColor[] = [
    '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
    '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
  ]

  // Размер координатной плоскости по умолчанию.
  public gridSize: SPlotGridSize = {
    width: 32_000,
    height: 16_000
  }

  // Размер полигона по умолчанию.
  public polygonSize: number = 20

  // Степень детализации круга по умолчанию.
  public circleApproxLevel: number = 12

  // Параметры режима отладки по умолчанию.
  public debugMode: SPlotDebugMode = {
    isEnable: false,
    output: 'console',
    headerStyle: 'font-weight: bold; color: #ffffff; background-color: #cc0000;',
    groupStyle: 'font-weight: bold; color: #ffffff;'
  }

  // Параметры режима демострационных данных по умолчанию.
  public demoMode: SPlotDemoMode = {
    isEnable: false,
    amount: 1_000_000,
    /**
     * По умолчанию в режиме демо-данных будут поровну отображаться полигоны всех возможных форм. Соответствующие
     * значения массива инициализируются при регистрации функций создания форм методом {@link registerShape}.
     */
    shapeQuota: [],
    index: 0
  }

  // Признак по умолчанию форсированного запуска рендера.
  public forceRun: boolean = false

  /**
   * По умолчанию искусственного ограничения на количество отображаемых полигонов нет (за счет задания большого заведомо
   * недостижимого порогового числа).
   */
  public maxAmountOfPolygons: number = 1_000_000_000

  // Фоновый цвет по умолчанию для канваса.
  public bgColor: HEXColor = '#ffffff'

  // Цвет по умолчанию для направляющих.
  public rulesColor: HEXColor = '#c0c0c0'

  // По умолчанию область просмотра устанавливается в центр координатной плооскости.
  public camera: SPlotCamera = {
    x: this.gridSize.width / 2,
    y: this.gridSize.height / 2,
    zoom: 1
  }

  /**
   * По умолчанию настройки контекста рендеринга WebGL максимизируют производительность графической системы. Специальных
   * пользовательских предустановок не требуется, однако приложение позволяет экспериментировать с настройками графики.
   */
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

  // Признак активного процесса рендера. Доступен пользователю приложения только для чтения.
  public isRunning: boolean = false

  // Объект канваса.
  protected readonly canvas: HTMLCanvasElement

  // Объект контекста рендеринга WebGL.
  protected gl!: WebGLRenderingContext

  // Объект программы WebGL.
  protected gpuProgram!: WebGLProgram

  // Переменные для связи приложения с программой WebGL.
  protected variables: { [key: string]: any } = {}

  /**
   * Шаблон GLSL-кода для вершинного шейдера. Содержит специальную вставку "SET-VERTEX-COLOR-CODE", которая перед
   * созданием шейдера заменяется на GLSL-код выбора цвета вершин.
   */
  protected readonly vertexShaderCodeTemplate: string =
    'attribute vec2 a_position;\n' +
    'attribute float a_color;\n' +
    'uniform mat3 u_matrix;\n' +
    'varying vec3 v_color;\n' +
    'void main() {\n' +
    '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);\n' +
    '  gl_PointSize = 20.0;\n' +
    '  SET-VERTEX-COLOR-CODE' +
    '}\n'

  // Шаблон GLSL-кода для фрагментного шейдера.
  protected readonly fragmentShaderCodeTemplate: string =
    'precision lowp float;\n' +
    'varying vec3 v_color;\n' +
    'void main() {\n' +
    '  gl_FragColor = vec4(v_color.rgb, 1.0);\n' +
    '}\n'

  // Счетчик числа обработанных полигонов.
  protected amountOfPolygons: number = 0

  /**
   *   Набор вспомогательных констант, используемых в часто повторяющихся вычислениях. Рассчитывается и задается в
   *   методе {@link setUsefulConstants}.
   */
  protected USEFUL_CONSTS: any[] = []

  // Техническая информация, используемая приложением для расчета трансформаций.
  protected transormation: SPlotTransformation = {
    viewProjectionMat: [],
    startInvViewProjMat: [],
    startCamera: {x:0, y:0, zoom: 1},
    startPos: [],
    startClipPos: [],
    startMousePos: []
  }

  /**
   * Максимальное возможное количество вершин в группе полигонов, которое еще допускает добавление одного самого
   * многовершинного полигона. Это количество имеет объективное техническое ограничение, т.к. функция
   * {@link drawElements} не позволяет корректно принимать больше 65536 индексов (32768 вершин).
   */
  protected maxAmountOfVertexPerPolygonGroup: number = 32768 - (this.circleApproxLevel + 1);

  // Информация о буферах, хранящих данные для видеопамяти.
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

  /**
   * Информация о возможных формах полигонов.
   * Каждая форма представляется функцией, вычисляющей ее вершины и названием формы.
   * Для указания формы полигонов в приложении используются числовые индексы в данном массиве.
   */
  protected shapes: {calc: SPlotCalcShapeFunc, name: string}[] = []

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
    this.registerShape(this.getVerticesOfPoint, 'Точка')

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
    let vertexShaderCode = this.vertexShaderCodeTemplate.replace('SET-VERTEX-COLOR-CODE', this.genShaderColorCode())
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
      console.group('%cСоздан шейдер [' + shaderType + ']', this.debugMode.groupStyle)
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
      console.log('%cЗапущен процесс загрузки данных [' + this.getCurrentTime() + ']...', this.debugMode.groupStyle)

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

  protected getVerticesOfPoint(x: number, y: number, consts: any[]): SPlotPolygonVertices {
    return {
      values: [x, y],
      indices: [0, 0, 0]
    }
  }

  /**
   * Вычисляет координаты вершин полигона треугольной формы.
   * Тип функции: {@link SPlotCalcShapeFunc}
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
   * Тип функции: {@link SPlotCalcShapeFunc}
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
   * Тип функции: {@link SPlotCalcShapeFunc}
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

    console.log('%cВключен режим отладки ' + this.constructor.name + ' на объекте [#' + this.canvas.id + ']',
      this.debugMode.headerStyle)

    if (this.demoMode.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this.debugMode.groupStyle)
    }

    console.group('%cПредупреждение', this.debugMode.groupStyle)
    {
      console.dir('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90')
    }
    console.groupEnd()

    console.group('%cВидеосистема', this.debugMode.groupStyle)
    {
      let ext = this.gl.getExtension('WEBGL_debug_renderer_info')
      let graphicsCardName = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]'
      console.log('Графическая карта: ' + graphicsCardName)
      console.log('Версия GL: ' + this.gl.getParameter(this.gl.VERSION))
    }
    console.groupEnd()

    console.group('%cНастройка параметров экземпляра', this.debugMode.groupStyle)
    {
      console.dir(this)
      console.log('Пользовательские настройки:\n', jsonStringify(options))
      console.log('Канвас: #' + this.canvas.id)
      console.log('Размер канваса: ' + this.canvas.width + ' x ' + this.canvas.height + ' px')
      console.log('Размер плоскости: ' + this.gridSize.width + ' x ' + this.gridSize.height + ' px')
      console.log('Размер полигона: ' + this.polygonSize + ' px')
      console.log('Апроксимация окружности: ' + this.circleApproxLevel + ' углов')

      /**
       * @todo Обработать этот вывод в зависимости от способа получения данных о полигонах. Ввести типы - заданная
       * функция итерирования, демо-итерирование, переданный массив данных.
       */
      if (this.demoMode.isEnable) {
        console.log('Способ получения данных: ' + 'демонстрационная функция итерирования')
      } else {
        console.log('Способ получения данных: ' + 'пользовательская функция итерирования')
      }
    }
    console.groupEnd()
  }

  /**
   * Выводит в консоль отладочную информацию о загрузке данных в видеопамять.
   */
  protected reportAboutObjectReading(): void {

    console.group('%cЗагрузка данных завершена [' + this.getCurrentTime() + ']', this.debugMode.groupStyle)
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

        console.log('Кол-во цветов в палитре: ' + this.polygonPalette.length)
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
 * =====================================================================================================================
 */

  /**
   *
   */
  protected makeCameraMatrix($this: SPlot) {

    const zoomScale = 1 / $this.camera.zoom!;

    let cameraMat = m3.identity();
    cameraMat = m3.translate(cameraMat, $this.camera.x, $this.camera.y);
    cameraMat = m3.scale(cameraMat, zoomScale, zoomScale);

    return cameraMat;
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
  protected updateViewProjection($this: SPlot): void {

    const projectionMat = m3.projection($this.gl.canvas.width, $this.gl.canvas.height);
    const cameraMat = $this.makeCameraMatrix($this);
    let viewMat = m3.inverse(cameraMat);
    $this.transormation.viewProjectionMat = m3.multiply(projectionMat, viewMat);
  }

  /**
   *
   */
  protected getClipSpaceMousePosition(event: MouseEvent) {

    const $this = SPlot.instances[(event.target as HTMLElement).id]

    // get canvas relative css position
    const rect = $this.canvas.getBoundingClientRect();
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;

    // get normalized 0 to 1 position across and down canvas
    const normalizedX = cssX / $this.canvas.clientWidth;
    const normalizedY = cssY / $this.canvas.clientHeight;

    // convert to clip space
    const clipX = normalizedX * 2 - 1;
    const clipY = normalizedY * -2 + 1;

    return [clipX, clipY];
  }

  /**
   *
   */
  protected moveCamera(event: MouseEvent): void {

    const $this = SPlot.instances[(event.target as HTMLElement).id]

    const pos = m3.transformPoint(
      $this.transormation.startInvViewProjMat,
      $this.getClipSpaceMousePosition(event)
    );

    $this.camera.x =
      $this.transormation.startCamera.x! + $this.transormation.startPos[0] - pos[0];

    $this.camera.y =
      $this.transormation.startCamera.y! + $this.transormation.startPos[1] - pos[1];

    $this.render();
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
    const $this = SPlot.instances[(event.target as HTMLElement).id]
    $this.moveCamera(event);
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
    const $this = SPlot.instances[(event.target as HTMLElement).id]
    $this.render();
    event.target!.removeEventListener('mousemove', $this.handleMouseMove as EventListener);
    event.target!.removeEventListener('mouseup', $this.handleMouseUp as EventListener);
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
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    event.preventDefault();
    $this.canvas.addEventListener('mousemove', $this.handleMouseMove as EventListener);
    $this.canvas.addEventListener('mouseup', $this.handleMouseUp as EventListener);

    $this.transormation.startInvViewProjMat = m3.inverse($this.transormation.viewProjectionMat);
    $this.transormation.startCamera = Object.assign({}, $this.camera);
    $this.transormation.startClipPos = $this.getClipSpaceMousePosition(event);
    $this.transormation.startPos = m3.transformPoint($this.transormation.startInvViewProjMat, $this.transormation.startClipPos);
    $this.transormation.startMousePos = [event.clientX, event.clientY];

    $this.render();
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
  protected handleMouseWheel_original(event: WheelEvent): void {
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    event.preventDefault();
    const [clipX, clipY] = $this.getClipSpaceMousePosition(event);

    // position before zooming
    const [preZoomX, preZoomY] = m3.transformPoint(m3.inverse($this.transormation.viewProjectionMat), [clipX, clipY]);

    // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
    const newZoom = $this.camera.zoom! * Math.pow(2, event.deltaY * -0.01);
    $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));

    $this.updateViewProjection($this);

    // position after zooming
    const [postZoomX, postZoomY] = m3.transformPoint(m3.inverse($this.transormation.viewProjectionMat), [clipX, clipY]);

    // camera needs to be moved the difference of before and after
    $this.camera.x! += preZoomX - postZoomX;
    $this.camera.y! += preZoomY - postZoomY;

    $this.render();
  }

  /**
   *
   */
  protected handleMouseWheel(event: WheelEvent): void {
    const $this = SPlot.instances[(event.target as HTMLElement).id]

    event.preventDefault();
    const [clipX, clipY] = $this.getClipSpaceMousePosition(event);

    // position before zooming
    const [preZoomX, preZoomY] = m3.transformPoint(
      m3.inverse($this.transormation.viewProjectionMat),
      [clipX, clipY]
    );

    // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
    const newZoom = $this.camera.zoom! * Math.pow(2, event.deltaY * -0.01);
    $this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));




    // This is --- $this.updateViewProjection($this);
    const projectionMat = m3.projection($this.gl.canvas.width, $this.gl.canvas.height);

      // This is --- const cameraMat = $this.makeCameraMatrix($this);
      const zoomScale = 1 / $this.camera.zoom;
      let cameraMat = m3.identity();
      cameraMat = m3.translate(cameraMat, $this.camera.x, $this.camera.y);
      cameraMat = m3.scale(cameraMat, zoomScale, zoomScale);

    let viewMat = m3.inverse(cameraMat);
    $this.transormation.viewProjectionMat = m3.multiply(projectionMat, viewMat);




    // position after zooming
    const [postZoomX, postZoomY] = m3.transformPoint(m3.inverse($this.transormation.viewProjectionMat), [clipX, clipY]);

    // camera needs to be moved the difference of before and after
    $this.camera.x! += preZoomX - postZoomX;
    $this.camera.y! += preZoomY - postZoomY;

    $this.render();
  }

  /**
   * =====================================================================================================================
   */

  /**
   * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
   */
  protected render(): void {

    // Очистка объекта рендеринга WebGL.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    // Обновление матрицы трансформации.
    this.updateViewProjection(this)

    // Привязка матрицы трансформации к переменной шейдера.
    this.gl.uniformMatrix3fv(this.variables['u_matrix'], false, this.transormation.viewProjectionMat)

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
      this.gl.drawElements(this.gl.POINTS, this.buffers.amountOfGLVertices[i], this.gl.UNSIGNED_SHORT, 0)
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
      console.log('%cРендеринг запущен', this.debugMode.groupStyle)
    }
  }

  /**
   * Останавливает рендеринг и "прослушку" событий мыши/трекпада на канвасе.
   *
   * @param clear - Признак неообходимости вместе с остановкой рендеринга очистить канвас. Значение true очищает канвас,
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
      console.log('%cРендеринг остановлен', this.debugMode.groupStyle)
    }
  }

  /**
   * Очищает канвас, закрашивая его в фоновый цвет.
   */
  public clear(): void {

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.log('%cКонтекст рендеринга очищен [' + this.bgColor + ']', this.debugMode.groupStyle);
    }
  }
}
