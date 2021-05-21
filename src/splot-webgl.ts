import SPlot from './splot'
import { colorFromHexToGlRgb } from './utils'

/** ****************************************************************************
 *
 * Класс, реализующий управление контекстом рендеринга WebGL класса Splot.
 */
export default class SPlotWebGl {

  /** Параметры инициализации контекста рендеринга WebGL. */
  public alpha: boolean = false
  public depth: boolean = false
  public stencil: boolean = false
  public antialias: boolean = false
  public desynchronized: boolean = false
  public premultipliedAlpha: boolean = false
  public preserveDrawingBuffer: boolean = false
  public failIfMajorPerformanceCaveat: boolean = false
  public powerPreference: WebGLPowerPreference = 'high-performance'

  /** Названия элементов графической системы клиента. */
  public gpu = { hardware: '-', software: '-' }

  /** Контекст рендеринга и программа WebGL. */
  private gl!: WebGLRenderingContext
  private gpuProgram!: WebGLProgram

  /** Переменные для связи приложения с программой WebGL. */
  private variables: Map<string, any> = new Map()

  /** Буферы видеопамяти WebGL. */
  public data: Map<string, {buffers: WebGLBuffer[], type: number}> = new Map()

  /** Правила соответствия типов типизированных массивов и типов переменных WebGL. */
  private glNumberTypes: Map<string, number> = new Map([
    ['Int8Array', 0x1400],       // gl.BYTE
    ['Uint8Array', 0x1401],      // gl.UNSIGNED_BYTE
    ['Int16Array', 0x1402],      // gl.SHORT
    ['Uint16Array', 0x1403],     // gl.UNSIGNED_SHORT
    ['Float32Array', 0x1406]     // gl.FLOAT
  ])

  constructor(
    private readonly splot: SPlot
  ) { }

  /** ****************************************************************************
   *
   * Подготавливает к использованию контекст рендеринга WebGL.
   */
  public setup(): void {

    this.gl = this.splot.canvas.getContext('webgl', {
      alpha: this.alpha,
      depth: this.depth,
      stencil: this.stencil,
      antialias: this.antialias,
      desynchronized: this.desynchronized,
      premultipliedAlpha: this.premultipliedAlpha,
      preserveDrawingBuffer: this.preserveDrawingBuffer,
      failIfMajorPerformanceCaveat: this.failIfMajorPerformanceCaveat,
      powerPreference: this.powerPreference
    })!

    if (this.gl === null) {
      throw new Error('Ошибка создания контекста рендеринга WebGL!')
    }

    /** Получение информации о графической системе клиента. */
    let ext = this.gl.getExtension('WEBGL_debug_renderer_info')
    this.gpu.hardware = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]'
    this.gpu.software = this.gl.getParameter(this.gl.VERSION)

    this.splot.debug.log('gpu')

    /** Кооректировка размера области просмотра. */
    this.splot.canvas.width = this.splot.canvas.clientWidth
    this.splot.canvas.height = this.splot.canvas.clientHeight
    this.gl.viewport(0, 0, this.splot.canvas.width, this.splot.canvas.height)
  }

  /** ****************************************************************************
   *
   * Устанавливает цвет фона контекста рендеринга WebGL.
   */
  public setBgColor(color: string): void {
    let [r, g, b] = colorFromHexToGlRgb(color)
    this.gl.clearColor(r, g, b, 0.0)
  }

  /** ****************************************************************************
   *
   * Закрашивает контекст рендеринга WebGL цветом фона.
   */
  public clearBackground(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /** ****************************************************************************
   *
   * Создает шейдер WebGL.
   *
   * @param type - Тип шейдера.
   * @param code - GLSL-код шейдера.
   * @returns Созданный шейдер.
   */
  public createShader(type: 'VERTEX_SHADER' | 'FRAGMENT_SHADER', code: string): WebGLShader {

    const shader = this.gl.createShader(this.gl[type])!
    this.gl.shaderSource(shader, code)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Ошибка компиляции шейдера [' + type + ']. ' + this.gl.getShaderInfoLog(shader))
    }

    return shader
  }

  /** ****************************************************************************
   *
   * Создает программу WebGL из шейдеров.
   *
   * @param shaderVert - Вершинный шейдер.
   * @param shaderFrag - Фрагментный шейдер.
   */
  public createProgramFromShaders(shaderVert: WebGLShader, shaderFrag: WebGLShader): void {

    this.gpuProgram = this.gl.createProgram()!
    this.gl.attachShader(this.gpuProgram, shaderVert)
    this.gl.attachShader(this.gpuProgram, shaderFrag)
    this.gl.linkProgram(this.gpuProgram)
    this.gl.useProgram(this.gpuProgram)

    this.splot.debug.log('shaders')
  }

  /** ****************************************************************************
   *
   * Создает программу WebGL из GLSL-кодов шейдеров.
   *
   * @param shaderCodeVert - Код вершинного шейдера.
   * @param shaderCodeFrag - Код фрагментного шейдера.
   */
  public createProgram(shaderCodeVert: string, shaderCodeFrag: string): void {
    this.createProgramFromShaders(
      this.createShader('VERTEX_SHADER', shaderCodeVert),
      this.createShader('FRAGMENT_SHADER', shaderCodeFrag)
    )
  }

  /** ****************************************************************************
   *
   * Создает связь переменной приложения с программой WebGl.
   *
   * @remarks
   * Переменные сохраняются в ассоциативном массиве, где ключи - это названия переменных. Название переменной должно
   * начинаться с префикса, обозначающего ее GLSL-тип. Префикс "u_" описывает переменную типа uniform. Префикс "a_"
   * описывает переменную типа attribute.
   *
   * @param varName - Имя переменной (строка).
   */
  public createVariable(varName: string): void {

    const varType = varName.slice(0, 2)

    if (varType === 'u_') {
      this.variables.set(varName, this.gl.getUniformLocation(this.gpuProgram, varName))
    } else if (varType === 'a_') {
      this.variables.set(varName, this.gl.getAttribLocation(this.gpuProgram, varName))
    } else {
      throw new Error('Указан неверный тип (префикс) переменной шейдера: ' + varName)
    }
  }

  /** ****************************************************************************
   *
   * Создает связь набора переменных приложения с программой WebGl.
   *
   * @remarks
   * Делает тоже самое, что и метод {@link createVariable}, но позволяет за один вызов создать сразу несколько
   * переменных.
   *
   * @param varNames - Перечисления имен переменных (строками).
   */
  public createVariables(...varNames: string[]): void {
    varNames.forEach(varName => this.createVariable(varName));
  }

  /** ****************************************************************************
   *
   * Создает в группе буферов WebGL новый буфер и записывает в него переданные данные.
   *
   * @remarks
   * Количество групп буферов и количество буферов в каждой группе не ограничены. Каждая группа имеет свое название и
   * GLSL-тип. Тип группы определяется автоматически на основе типа типизированного массива. Правила соответствия типов
   * определяются переменной {@link glNumberTypes}.
   *
   * @param groupName - Название группы буферов, в которую будет добавлен новый буфер.
   * @param data - Данные в виде типизированного массива для записи в создаваемый буфер.
   * @returns Объем памяти, занятый новым буфером (в байтах).
   */
  public createBuffer(groupName: string, data: TypedArray): number {

    const buffer = this.gl.createBuffer()!
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW)

    /** Если группы с указанным названием не существует, то она создается. */
    if (!this.data.has(groupName)) {
      this.data.set(groupName, { buffers: [], type: this.glNumberTypes.get(data.constructor.name)!})
    }

    this.data.get(groupName)!.buffers.push(buffer)

    return data.length * data.BYTES_PER_ELEMENT
  }

  /** ****************************************************************************
   *
   * Передает значение матрицы 3 х 3 в программу WebGl.
   *
   * @param varName - Имя переменной WebGL (из массива {@link variables}) в которую будет записано переданное значение.
   * @param varValue - Устанавливаемое значение должно являться матрицей вещественных чисел размером 3 х 3, развернутой
   *     в виде одномерного массива из 9 элементов.
   */
  public setVariable(varName: string, varValue: number[]): void {
    this.gl.uniformMatrix3fv(this.variables.get(varName), false, varValue)
  }

  /** ****************************************************************************
   *
   * Делает буфер WebGl "активным".
   *
   * @param groupName - Название группы буферов, в котором хранится необходимый буфер.
   * @param index - Индекс буфера в группе.
   * @param varName - Имя переменной (из массива {@link variables}), с которой будет связан буфер.
   * @param size - Количество элементов в буфере, соответствующих одной  GL-вершине.
   * @param stride - Размер шага обработки элементов буфера (значение 0 задает размещение элементов друг за другом).
   * @param offset - Смещение относительно начала буфера, начиная с которого будет происходить обработка элементов.
   */
  public setBuffer(groupName: string, index: number, varName: string, size: number, stride: number, offset: number): void {

    const group = this.data.get(groupName)!
    const variable = this.variables.get(varName)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, group.buffers[index])
    this.gl.enableVertexAttribArray(variable)
    this.gl.vertexAttribPointer(variable, size, group.type, false, stride, offset)
  }

  /** ****************************************************************************
   *
   * Выполняет отрисовку контекста рендеринга WebGL методом примитивных точек.
   *
   * @param first - Индекс GL-вершины, с которой начнетя отрисовка.
   * @param count - Количество орисовываемых GL-вершин.
   */
  public drawPoints(first: number, count: number): void {
    this.gl.drawArrays(this.gl.POINTS, first, count)
  }
}
