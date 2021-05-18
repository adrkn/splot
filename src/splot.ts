// @ts-ignore
import m3 from './m3'
import { copyMatchingKeyValues, randomInt, jsonStringify, randomQuotaIndex, colorFromHexToGlRgb, getCurrentTime } from './utils'
import vertexShaderCode from './vertex-shader'
import fragmentShaderCode from './fragment-shader'

export default class SPlot {

  // Функция по умолчанию для итерирования объектов не задается.
  public iterationCallback: SPlotIterationFunction | undefined = undefined

  // Цветовая палитра полигонов по умолчанию.
  public polygonPalette: string[] = [
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
  public bgColor: string = '#ffffff'

  // Цвет по умолчанию для направляющих.
  public rulesColor: string = '#c0c0c0'

  // По умолчанию область просмотра устанавливается в центр координатной плооскости.
  public camera: SPlotCamera = {
    x: this.gridSize.width / 2,
    y: this.gridSize.height / 2,
    zoom: 1
  }

  public useVertexIndices: boolean = false

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
   * Шаблон GLSL-кода для вершинного шейдера. Содержит специальную вставку "{ADDITIONAL-CODE}", которая перед
   * созданием шейдера заменяется на GLSL-код выбора цвета вершин.
   */
  protected readonly vertexShaderCodeTemplate: string = vertexShaderCode

  // Шаблон GLSL-кода для фрагментного шейдера.
  protected readonly fragmentShaderCodeTemplate: string = fragmentShaderCode

  // Счетчик числа обработанных полигонов.
  protected amountOfPolygons: number = 0

  // Техническая информация, используемая приложением для расчета трансформаций.
  protected transform: SPlotTransform = {
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
//  protected maxAmountOfVertexPerPolygonGroup: number = 32768 - (this.circleApproxLevel + 1);
  protected maxAmountOfVertexPerPolygonGroup: number = 10_000

  // Информация о буферах, хранящих данные для видеопамяти.
  protected buffers: SPlotBuffers = {
    vertexBuffers: [],
    colorBuffers: [],
    sizeBuffers: [],
    shapeBuffers: [],
    indexBuffers: [],
    amountOfGLVertices: [],
    amountOfShapes: [],
    amountOfBufferGroups: 0,
    amountOfTotalVertices: 0,
    amountOfTotalGLVertices: 0,
    sizeInBytes: [0, 0, 0, 0]
  }

  /**
   * Информация о возможных формах полигонов.
   * Каждая форма представляется функцией, вычисляющей ее вершины и названием формы.
   * Для указания формы полигонов в приложении используются числовые индексы в данном массиве.
   */
  protected shapes: {calc: SPlotCalcShapeFunc, name: string}[] = []

  protected handleMouseDownWithContext: EventListener = this.handleMouseDown.bind(this) as EventListener
  protected handleMouseWheelWithContext: EventListener = this.handleMouseWheel.bind(this) as EventListener
  protected handleMouseMoveWithContext: EventListener = this.handleMouseMove.bind(this) as EventListener
  protected handleMouseUpWithContext: EventListener = this.handleMouseUp.bind(this) as EventListener

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

    if (document.getElementById(canvasId)) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    } else {
      throw new Error('Канвас с идентификатором "#' + canvasId +  '" не найден!')
    }

    this.registerShape(this.getVerticesOfPoint, 'Точка')

    if (options) {
      this.setOptions(options)    // Если переданы настройки, то они применяются.

      if (this.forceRun) {
        this.setup(options)       //  Инициализация всех параметров рендера, если запрошен форсированный запуск.
      }
    }
  }

  /**
   * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
   */
  protected createGl(): void {

    this.gl = this.canvas.getContext('webgl', this.webGlSettings)!

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
   * Инициализирует необходимые для рендера параметры экземпляра и WebGL.
   *
   * @param options - Пользовательские настройки экземпляра.
   */
  public setup(options: SPlotOptions): void {

    this.setOptions(options)     // Применение пользовательских настроек.
    this.createGl()              // Создание контекста рендеринга.
    this.amountOfPolygons = 0    // Обнуление счетчика полигонов.
    this.demoMode.index = 0      // Обнуление технического счетчика режима демо-данных.

    for (const key in this.shapes) {
      this.buffers.amountOfShapes[key] = 0    // Обнуление счетчиков форм полигонов.
    }

    if (this.debugMode.isEnable) {
      this.reportMainInfo(options)    // Вывод отладочной информации.
    }

    (this.gl.clearColor as any)(...colorFromHexToGlRgb(this.bgColor), 0.0)    // Установка цвета очистки рендеринга

    // Подготовка кодов шейдеров. В код вершинного шейдера вставляется код выбора цвета вершин.
    const vertexShaderCode = this.vertexShaderCodeTemplate.replace('{ADDITIONAL-CODE}', this.genShaderColorCode())
    const fragmentShaderCode = this.fragmentShaderCodeTemplate

    // Создание шейдеров WebGL.
    const vertexShader = this.createWebGlShader('VERTEX_SHADER', vertexShaderCode)
    const fragmentShader = this.createWebGlShader('FRAGMENT_SHADER', fragmentShaderCode)

    // Создание программы WebGL.
    this.createWebGlProgram(vertexShader, fragmentShader)

    // Установка связей переменных приложения с программой WebGl.
    this.setWebGlVariable('attribute', 'a_position')
    this.setWebGlVariable('attribute', 'a_color')
    this.setWebGlVariable('attribute', 'a_polygonsize')
    this.setWebGlVariable('attribute', 'a_shape')
    this.setWebGlVariable('uniform', 'u_matrix')

    this.createWbGlBuffers()    // Заполнение буферов WebGL.

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
    if (options.hasOwnProperty('gridSize') && !options.hasOwnProperty('camera')) {
      this.camera.x = this.gridSize.width / 2
      this.camera.y = this.gridSize.height / 2
    }

    if (this.demoMode.isEnable) {
      this.iterationCallback = this.demoIterationCallback    // Имитация итерирования для демо-режима.
    }
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
    const shader = this.gl.createShader(this.gl[shaderType])!
    this.gl.shaderSource(shader, shaderCode)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this.gl.getShaderInfoLog(shader))
    }

    // Вывод отладочной информации.
    if (this.debugMode.isEnable) {
      console.group('%cСоздан шейдер [' + shaderType + ']', this.debugMode.groupStyle)
      console.log(shaderCode)
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
    this.gpuProgram = this.gl.createProgram()!
    this.gl.attachShader(this.gpuProgram, vertexShader)
    this.gl.attachShader(this.gpuProgram, fragmentShader)
    this.gl.linkProgram(this.gpuProgram)
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
      console.log('%cЗапущен процесс загрузки данных [' + getCurrentTime() + ']...', this.debugMode.groupStyle)

      // Запуск консольного таймера, измеряющего длительность процесса загрузки данных в видеопамять.
      console.time('Длительность')
    }

    let polygonGroup: SPlotPolygonGroup | null

    // Итерирование групп полигонов.
    while (polygonGroup = this.createPolygonGroup()) {

      // Создание и заполнение буферов данными о текущей группе полигонов.
      this.addWbGlBuffer(this.buffers.vertexBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.vertices), 0)
      this.addWbGlBuffer(this.buffers.colorBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.colors), 1)
      this.addWbGlBuffer(this.buffers.shapeBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.shapes), 4)
      this.addWbGlBuffer(this.buffers.sizeBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.sizes), 3)
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
      sizes: [],
      shapes: [],
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

  protected getVerticesOfPoint(x: number, y: number, size: number, shape: number): SPlotPolygonVertices {
    return {
      values: [x, y],
      indices: [0, 0, 0],
      size: size,
      shape: shape
    }
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
    const vertices = this.shapes[0].calc(
      polygon.x, polygon.y, polygon.size, polygon.shape
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

    polygonGroup.shapes.push(vertices.shape)

    polygonGroup.sizes.push(vertices.size)

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

    console.group('%cЗагрузка данных завершена [' + getCurrentTime() + ']', this.debugMode.groupStyle)
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

      let bytesUsedByBuffers = this.buffers.sizeInBytes[0] + this.buffers.sizeInBytes[1] + this.buffers.sizeInBytes[2] + this.buffers.sizeInBytes[3]

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

        console.log('Буферы размеров: '
          + (this.buffers.sizeInBytes[3] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
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
      let [r, g, b] = colorFromHexToGlRgb(this.polygonPalette[i])

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
 * =====================================================================================================================
 */

  protected makeCameraMatrix() {

    const zoomScale = 1 / this.camera.zoom!;

    let cameraMat = m3.identity();
    cameraMat = m3.translate(cameraMat, this.camera.x, this.camera.y);
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
   */
  protected updateViewProjection(): void {

    const projectionMat = m3.projection(this.gl.canvas.width, this.gl.canvas.height);
    const cameraMat = this.makeCameraMatrix();
    let viewMat = m3.inverse(cameraMat);
    this.transform.viewProjectionMat = m3.multiply(projectionMat, viewMat);
  }

  /**
   *
   */
  protected getClipSpaceMousePosition(event: MouseEvent) {

    // get canvas relative css position
    const rect = this.canvas.getBoundingClientRect();
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;

    // get normalized 0 to 1 position across and down canvas
    const normalizedX = cssX / this.canvas.clientWidth;
    const normalizedY = cssY / this.canvas.clientHeight;

    // convert to clip space
    const clipX = normalizedX * 2 - 1;
    const clipY = normalizedY * -2 + 1;

    return [clipX, clipY];
  }

  /**
   *
   */
  protected moveCamera(event: MouseEvent): void {

    const pos = m3.transformPoint(
      this.transform.startInvViewProjMat,
      this.getClipSpaceMousePosition(event)
    );

    this.camera.x =
      this.transform.startCamera.x! + this.transform.startPos[0] - pos[0];

    this.camera.y =
      this.transform.startCamera.y! + this.transform.startPos[1] - pos[1];

    this.render();
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
    this.moveCamera.call(this, event);
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
    this.render();
    event.target!.removeEventListener('mousemove', this.handleMouseMoveWithContext);
    event.target!.removeEventListener('mouseup', this.handleMouseUpWithContext);
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

    event.preventDefault();
    this.canvas.addEventListener('mousemove', this.handleMouseMoveWithContext);
    this.canvas.addEventListener('mouseup', this.handleMouseUpWithContext);

    this.transform.startInvViewProjMat = m3.inverse(this.transform.viewProjectionMat);
    this.transform.startCamera = Object.assign({}, this.camera);
    this.transform.startClipPos = this.getClipSpaceMousePosition.call(this, event);
    this.transform.startPos = m3.transformPoint(this.transform.startInvViewProjMat, this.transform.startClipPos);
    this.transform.startMousePos = [event.clientX, event.clientY];

    this.render();
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

    event.preventDefault();
    const [clipX, clipY] = this.getClipSpaceMousePosition.call(this, event);

    // position before zooming
    const [preZoomX, preZoomY] = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]);

    // multiply the wheel movement by the current zoom level, so we zoom less when zoomed in and more when zoomed out
    const newZoom = this.camera.zoom! * Math.pow(2, event.deltaY * -0.01);
    this.camera.zoom = Math.max(0.002, Math.min(200, newZoom));

    this.updateViewProjection.call(this);

    // position after zooming
    const [postZoomX, postZoomY] = m3.transformPoint(m3.inverse(this.transform.viewProjectionMat), [clipX, clipY]);

    // camera needs to be moved the difference of before and after
    this.camera.x! += preZoomX - postZoomX;
    this.camera.y! += preZoomY - postZoomY;

    this.render();
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
    this.updateViewProjection()

    // Привязка матрицы трансформации к переменной шейдера.
    this.gl.uniformMatrix3fv(this.variables['u_matrix'], false, this.transform.viewProjectionMat)

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

      // Установка текущего буфера размеров вершин и его привязка к переменной шейдера.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.sizeBuffers[i])
      this.gl.enableVertexAttribArray(this.variables['a_polygonsize'])
      this.gl.vertexAttribPointer(this.variables['a_polygonsize'], 1, this.gl.FLOAT, false, 0, 0)

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.shapeBuffers[i])
      this.gl.enableVertexAttribArray(this.variables['a_shape'])
      this.gl.vertexAttribPointer(this.variables['a_shape'], 1, this.gl.UNSIGNED_BYTE, false, 0, 0)

      if (this.useVertexIndices) {

        // Установка текущего буфера индексов вершин.
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffers[i])

        // Рендеринг текущей группы буферов.
        this.gl.drawElements(this.gl.POINTS, this.buffers.amountOfGLVertices[i], this.gl.UNSIGNED_SHORT, 0)
      } else {
        this.gl.drawArrays(this.gl.POINTS, 0, this.buffers.amountOfGLVertices[i] / 3)
      }
    }
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
        shape: randomQuotaIndex(this.demoMode.shapeQuota!),
        size: 1 + randomInt(20),
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

      this.canvas.addEventListener('mousedown', this.handleMouseDownWithContext)
      this.canvas.addEventListener('wheel', this.handleMouseWheelWithContext)

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

      this.canvas.removeEventListener('mousedown', this.handleMouseDownWithContext)
      this.canvas.removeEventListener('wheel', this.handleMouseWheelWithContext)
      this.canvas.removeEventListener('mousemove', this.handleMouseMoveWithContext)
      this.canvas.removeEventListener('mouseup', this.handleMouseUpWithContext)

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
