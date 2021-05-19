import { copyMatchingKeyValues, randomInt, randomQuotaIndex, colorFromHexToGlRgb} from './utils'
import SPlotDebug from './splot-debug'
import shaderCodeVert from './shader-vert'
import shaderCodeFrag from './shader-frag'
import SPlotContol from './splot-control'

export default class SPlot {

  public iterationCallback: SPlotIterationFunction = undefined    // Функция итерирования объектов.
  public debug: SPlotDebug = new SPlotDebug(this)                 // Объект, управляющий режимом отладки.
  public forceRun: boolean = false                                // Признак форсированного запуска рендера.
  public maxAmountOfPolygons: number = 1_000_000_000              // Искусственное ограничение кол-ва объектов.
  public isRunning: boolean = false                               // Признак активного процесса рендера.

  // Цветовая палитра полигонов по умолчанию.
  public polygonPalette: string[] = [
    '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00',
    '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080'
  ]

  // Параметры координатной плоскости по умолчанию.
  public grid: SPlotGrid = {
    width: 32_000,
    height: 16_000,
    bgColor: '#ffffff',
    rulesColor: '#c0c0c0'
  }

  // Параметры режима демострационных данных по умолчанию.
  public demoMode: SPlotDemoMode = {
    isEnable: false,
    amount: 1_000_000,
    shapeQuota: [],
    index: 0
  }

  // По умолчанию область просмотра устанавливается в центр координатной плооскости.
  public camera: SPlotCamera = {
    x: this.grid.width! / 2,
    y: this.grid.height! / 2,
    zoom: 1
  }

  public readonly shapes: { name: string }[] = []

  // Настройки контекста рендеринга WebGL максимизирующие производительность графической системы.
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

  public canvas: HTMLCanvasElement                       // Объект канваса.
  public gl!: WebGLRenderingContext                      // Объект контекста рендеринга WebGL.

  protected gpuProgram!: WebGLProgram                       // Объект программы WebGL.
  protected variables: { [key: string]: any } = {}          // Переменные для связи приложения с программой WebGL.
  protected shaderCodeVert: string = shaderCodeVert         // Шаблон GLSL-кода для вершинного шейдера.
  protected shaderCodeFrag: string = shaderCodeFrag         // Шаблон GLSL-кода для фрагментного шейдера.
  protected amountOfPolygons: number = 0                    // Счетчик числа обработанных полигонов.
  protected maxAmountOfVertexInGroup: number = 10_000       // Максимальное кол-во вершин в группе.
  protected control: SPlotContol = new SPlotContol(this)    // Объект управления графиком устройствами ввода.

  // Техническая информация, используемая приложением для расчета трансформаций.
  public transform: SPlotTransform = {
    viewProjectionMat: [],
    startInvViewProjMat: [],
    startCamera: {x: 0, y: 0, zoom: 1},
    startPos: [],
    startClipPos: [],
    startMousePos: []
  }

  // Информация о буферах, хранящих данные для видеопамяти.
  protected buffers: SPlotBuffers = {
    vertexBuffers: [],
    colorBuffers: [],
    sizeBuffers: [],
    shapeBuffers: [],
    amountOfGLVertices: [],
    amountOfShapes: [],
    amountOfBufferGroups: 0,
    amountOfTotalVertices: 0,
    amountOfTotalGLVertices: 0,
    sizeInBytes: [0, 0, 0, 0]
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

    if (document.getElementById(canvasId)) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    } else {
      throw new Error('Канвас с идентификатором "#' + canvasId +  '" не найден!')
    }

    // Добавление формы в массив форм.
    this.shapes.push({
      name: 'Точка'
    })
    // Добавление формы в массив частот появления в демо-режиме.
    this.demoMode.shapeQuota!.push(1)

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

    if (this.debug.isEnable) {
      this.debug.logIntro(this.canvas)
      this.debug.logGpuInfo(this.gl)
      this.debug.logInstanceInfo(this.canvas, options)
    }

    (this.gl.clearColor as any)(...colorFromHexToGlRgb(this.grid.bgColor!), 0.0)    // Установка цвета очистки рендеринга

    // Создание шейдеров и программы WebGL.
    this.createWebGlProgram(
      this.createWebGlShader('VERTEX_SHADER', this.shaderCodeVert.replace('{EXTERNAL-CODE}', this.genShaderColorCode())),
      this.createWebGlShader('FRAGMENT_SHADER', this.shaderCodeFrag)
    )

    // Установка связей переменных приложения с программой WebGl.
    this.setWebGlVariable('attribute', 'a_position')
    this.setWebGlVariable('attribute', 'a_color')
    this.setWebGlVariable('attribute', 'a_polygonsize')
    this.setWebGlVariable('attribute', 'a_shape')
    this.setWebGlVariable('uniform', 'u_matrix')

    this.createWebGlBuffers()    // Заполнение буферов WebGL.

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
    if (this.debug.isEnable) {
      this.debug.logShaderInfo(shaderType, shaderCode)
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
  protected createWebGlBuffers(): void {

    // Вывод отладочной информации.
    if (this.debug.isEnable) {
      this.debug.logDataLoadingStart()
    }

    let polygonGroup: SPlotPolygonGroup | null

    // Итерирование групп полигонов.
    while (polygonGroup = this.createPolygonGroup()) {

      // Создание и заполнение буферов данными о текущей группе полигонов.
      this.addWebGlBuffer(this.buffers.vertexBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.vertices), 0)
      this.addWebGlBuffer(this.buffers.colorBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.colors), 1)
      this.addWebGlBuffer(this.buffers.shapeBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.shapes), 4)
      this.addWebGlBuffer(this.buffers.sizeBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.sizes), 3)

      // Счетчик количества буферов.
      this.buffers.amountOfBufferGroups++

      // Счетчик количества вершин GL-треугольников текущей группы буферов.
      this.buffers.amountOfGLVertices.push(polygonGroup.amountOfGLVertices)

      // Счетчик общего количества вершин GL-треугольников.
      this.buffers.amountOfTotalGLVertices += polygonGroup.amountOfGLVertices
    }

    // Вывод отладочной информации.
    if (this.debug.isEnable) {
      this.debug.logDataLoadingComplete(this.amountOfPolygons, this.maxAmountOfPolygons)
      this.debug.logObjectStats(this.buffers, this.amountOfPolygons)
      this.debug.logGpuMemStats(this.buffers)
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
      colors: [],
      sizes: [],
      shapes: [],
      amountOfVertices: 0,
      amountOfGLVertices: 0
    }

    let polygon: SPlotPolygon | null | undefined

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
      if (polygonGroup.amountOfVertices >= this.maxAmountOfVertexInGroup) break
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
  protected addWebGlBuffer(buffers: WebGLBuffer[], type: WebGlBufferType, data: TypedArray, key: number): void {

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
   * Создает и добавляет в группу полигонов новый полигон.
   *
   * @param polygonGroup - Группа полигонов, в которую происходит добавление.
   * @param polygon - Информация о добавляемом полигоне.
   */
  protected addPolygon(polygonGroup: SPlotPolygonGroup, polygon: SPlotPolygon): void {

    /**
     * Добавление в группу полигонов индексов вершин нового полигона и подсчет общего количества вершин GL-треугольников
     * в группе.
     */
    polygonGroup.amountOfGLVertices++

    // Добавление в группу полигонов вершин нового полигона и подсчет общего количества вершин в группе.
    polygonGroup.vertices.push(polygon.x, polygon.y)
    polygonGroup.amountOfVertices++

    polygonGroup.shapes.push(polygon.shape)
    polygonGroup.sizes.push(polygon.size)
    polygonGroup.colors.push(polygon.color)
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
    this.polygonPalette.push(this.grid.rulesColor!)

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
   * Производит рендеринг графика в соответствии с текущими параметрами трансформации.
   */
  public render(): void {

    // Очистка объекта рендеринга WebGL.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    // Обновление матрицы трансформации.
    this.control.updateViewProjection()

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

      this.gl.drawArrays(this.gl.POINTS, 0, this.buffers.amountOfGLVertices[i] / 3)
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
        x: randomInt(this.grid.width!),
        y: randomInt(this.grid.height!),
        shape: randomQuotaIndex(this.demoMode.shapeQuota!),
        size: 10 + randomInt(21),
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

      this.control.run()

      this.render()

      this.isRunning = true
    }

    // Вывод отладочной информации.
    if (this.debug.isEnable) {
      console.log('%cРендеринг запущен', this.debug.groupStyle)
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

      this.control.stop()

      if (clear) {
        this.clear()
      }

      this.isRunning = false
    }

    // Вывод отладочной информации.
    if (this.debug.isEnable) {
      console.log('%cРендеринг остановлен', this.debug.groupStyle)
    }
  }

  /**
   * Очищает канвас, закрашивая его в фоновый цвет.
   */
  public clear(): void {

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Вывод отладочной информации.
    if (this.debug.isEnable) {
      console.log('%cКонтекст рендеринга очищен [' + this.grid.bgColor + ']', this.debug.groupStyle);
    }
  }
}
