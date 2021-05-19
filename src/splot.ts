import { copyMatchingKeyValues, randomInt, randomQuotaIndex, colorFromHexToGlRgb } from './utils'
import SPlotWebGl from './splot-webgl'
import SPlotDebug from './splot-debug'
import SPlotContol from './splot-control'
import shaderCodeVertTmpl from './shader-code-vert-tmpl'
import shaderCodeFragTmpl from './shader-code-frag-tmpl'

export default class SPlot {

  public iterationCallback: SPlotIterationFunction = undefined    // Функция итерирования объектов.
  public debug: SPlotDebug = new SPlotDebug(this)                 // Объект, управляющий режимом отладки.
  public webGl: SPlotWebGl = new SPlotWebGl(this)                 // Объект управления webGL.
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

  public canvas: HTMLCanvasElement                       // Объект канваса.
  public gl!: WebGLRenderingContext                      // Объект контекста рендеринга WebGL.

  public gpuProgram!: WebGLProgram                       // Объект программы WebGL.
  public variables: { [key: string]: any } = {}          // Переменные для связи приложения с программой WebGL.
  protected shaderCodeVert: string = shaderCodeVertTmpl         // Шаблон GLSL-кода для вершинного шейдера.
  protected shaderCodeFrag: string = shaderCodeFragTmpl         // Шаблон GLSL-кода для фрагментного шейдера.
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
  public buffers: SPlotBuffers = {
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
   * Инициализирует необходимые для рендера параметры экземпляра и WebGL.
   *
   * @param options - Пользовательские настройки экземпляра.
   */
  public setup(options: SPlotOptions): void {

    this.setOptions(options)     // Применение пользовательских настроек.
    this.webGl.create()              // Создание контекста рендеринга.
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

    this.webGl.setBgColor(this.grid.bgColor!)    // Установка цвета очистки рендеринга

    // Создание шейдеров WebGL.
    const shaderCodeVert = this.shaderCodeVert.replace('{EXTERNAL-CODE}', this.genShaderColorCode())
    const shaderCodeFrag = this.shaderCodeFrag

    const shaderVert = this.webGl.createShader('VERTEX_SHADER', shaderCodeVert)
    const shaderFrag = this.webGl.createShader('FRAGMENT_SHADER', shaderCodeFrag)

    // Вывод отладочной информации.
    if (this.debug.isEnable) {
      this.debug.logShaderInfo('VERTEX_SHADER', shaderCodeVert)
      this.debug.logShaderInfo('FRAGMENT_SHADER', shaderCodeFrag)
    }

    // Создание программы WebGL.
    this.webGl.createProgram(shaderVert, shaderFrag)


    // Установка связей переменных приложения с программой WebGl.
    this.webGl.createVariable('attribute', 'a_position')
    this.webGl.createVariable('attribute', 'a_color')
    this.webGl.createVariable('attribute', 'a_polygonsize')
    this.webGl.createVariable('attribute', 'a_shape')
    this.webGl.createVariable('uniform', 'u_matrix')

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
      this.webGl.createBuffer(this.buffers.vertexBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.vertices), 0)
      this.webGl.createBuffer(this.buffers.colorBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.colors), 1)
      this.webGl.createBuffer(this.buffers.shapeBuffers, 'ARRAY_BUFFER', new Uint8Array(polygonGroup.shapes), 4)
      this.webGl.createBuffer(this.buffers.sizeBuffers, 'ARRAY_BUFFER', new Float32Array(polygonGroup.sizes), 3)

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
   * Имитирует итерирование исходных объектов.
   *
   * @returns Информация о полигоне или null, если итерирование завершилось.
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

    this.webGl.clearBackground()

    if (this.debug.isEnable) {
      this.debug.logCanvasCleared()
    }
  }
}
