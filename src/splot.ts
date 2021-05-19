import { copyMatchingKeyValues, colorFromHexToGlRgb } from './utils'
import SHADER_CODE_VERT_TMPL from './shader-code-vert-tmpl'
import SHADER_CODE_FRAG_TMPL from './shader-code-frag-tmpl'
import SPlotContol from './splot-control'
import SPlotWebGl from './splot-webgl'
import SPlotDebug from './splot-debug'
import SPlotDemo from './splot-demo'

export default class SPlot {

  public iterator: SPlotIterator = undefined         // Функция итерирования исходных данных.
  public demo: SPlotDemo = new SPlotDemo(this)       // Хелпер режима демо-данных.
  public webGl: SPlotWebGl = new SPlotWebGl(this)    // Хелпер WebGL.
  public debug: SPlotDebug = new SPlotDebug(this)    // Хелпер режима отладки
  public forceRun: boolean = false                   // Признак форсированного запуска рендера.
  public globalLimit: number = 1_000_000_000         // Ограничение кол-ва объектов на графике.
  public groupLimit: number = 10_000                 // Ограничение кол-ва объектов в группе.
  public isRunning: boolean = false                  // Признак активного процесса рендера.

  // Цветовая палитра объектов.
  public colors: string[] = [
    '#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00',
    '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'
  ]

  // Параметры координатной плоскости.
  public grid: SPlotGrid = {
    width: 32_000,
    height: 16_000,
    bgColor: '#ffffff',
    rulesColor: '#c0c0c0'
  }

  // Параметры области просмотра.
  public camera: SPlotCamera = {
    x: this.grid.width! / 2,
    y: this.grid.height! / 2,
    zoom: 1
  }

  public readonly shapes: { name: string }[] = []
  protected shaderCodeVert: string = SHADER_CODE_VERT_TMPL         // Шаблон GLSL-кода для вершинного шейдера.
  protected shaderCodeFrag: string = SHADER_CODE_FRAG_TMPL         // Шаблон GLSL-кода для фрагментного шейдера.
  protected amountOfPolygons: number = 0                    // Счетчик числа обработанных полигонов.

  protected control: SPlotContol = new SPlotContol(this)    // Объект управления графиком устройствами ввода.

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

    this.webGl.prepare(canvasId)

    // Добавление формы в массив форм.
    this.shapes.push({
      name: 'Точка'
    })
    // Добавление формы в массив частот появления в демо-режиме.
    this.demo.shapeQuota!.push(1)

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
    this.demo.init()      // Обнуление технического счетчика режима демо-данных.

    for (const key in this.shapes) {
      this.buffers.amountOfShapes[key] = 0    // Обнуление счетчиков форм полигонов.
    }

    if (this.debug.isEnable) {
      this.debug.logIntro(this.webGl.canvas)
      this.debug.logGpuInfo(this.webGl.gl)
      this.debug.logInstanceInfo(this.webGl.canvas, options)
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

    if (this.demo.isEnable) {
      this.iterator = this.demo.demoIterationCallback    // Имитация итерирования для демо-режима.
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
      this.debug.logDataLoadingComplete(this.amountOfPolygons, this.globalLimit)
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
    if (this.amountOfPolygons >= this.globalLimit) return null

    // Итерирование исходных объектов.
    while (polygon = this.iterator!()) {

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
      if (this.amountOfPolygons >= this.globalLimit) break

      /**
       * Если общее количество всех вершин в группе полигонов превысило техническое ограничение, то группа полигонов
       * считается сформированной и итерирование исходных объектов приостанавливается.
       */
      if (polygonGroup.amountOfVertices >= this.groupLimit) break
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
    this.webGl.clearBackground()

    // Обновление матрицы трансформации.
    this.control.updateViewProjection()

    // Привязка матрицы трансформации к переменной шейдера.
    this.webGl.setVariable('u_matrix', this.control.transform.viewProjectionMat)

    // Итерирование и рендеринг групп буферов WebGL.
    for (let i = 0; i < this.buffers.amountOfBufferGroups; i++) {

      this.webGl.setBuffer(this.buffers.vertexBuffers[i], 'a_position', this.webGl.gl.FLOAT, 2, 0, 0)
      this.webGl.setBuffer(this.buffers.colorBuffers[i], 'a_color', this.webGl.gl.UNSIGNED_BYTE, 1, 0, 0)
      this.webGl.setBuffer(this.buffers.sizeBuffers[i], 'a_polygonsize', this.webGl.gl.FLOAT, 1, 0, 0)
      this.webGl.setBuffer(this.buffers.shapeBuffers[i], 'a_shape', this.webGl.gl.UNSIGNED_BYTE, 1, 0, 0)

      this.webGl.draw(0, this.buffers.amountOfGLVertices[i] / 3)
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

    this.webGl.clearBackground()

    if (this.debug.isEnable) {
      this.debug.logCanvasCleared()
    }
  }
}
