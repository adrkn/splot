import SPlot from './splot'
import { colorFromHexToGlRgb } from './utils'

export default class SPlotWebGl {

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

  private splot: SPlot
  public canvas!: HTMLCanvasElement
  public gl!: WebGLRenderingContext
  private gpuProgram!: WebGLProgram
  private variables: { [key: string]: any } = {}

  constructor(splot: SPlot) {
    this.splot = splot
  }

  public prepare(canvasId: string) {
    if (document.getElementById(canvasId)) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    } else {
      throw new Error('Канвас с идентификатором "#' + canvasId + '" не найден!')
    }
  }

  /**
   * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
   */
  public create(): void {

    this.gl = this.canvas.getContext('webgl', this.webGlSettings)!

    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  public setBgColor(color: string) {
    let [r, g, b] = colorFromHexToGlRgb(color)
    this.gl.clearColor(r, g, b, 0.0)
  }

  public clearBackground() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * Создает шейдер WebGL.
   *
   * @param shaderType Тип шейдера.
   * @param shaderCode Код шейдера на языке GLSL.
   * @returns Созданный объект шейдера.
   */
  public createShader(shaderType: WebGlShaderType, shaderCode: string): WebGLShader {

    // Создание, привязка кода и компиляция шейдера.
    const shader = this.gl.createShader(this.gl[shaderType])!
    this.gl.shaderSource(shader, shaderCode)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this.gl.getShaderInfoLog(shader))
    }

    return shader
  }

  /**
   * Создает программу WebGL.
   *
   * @param {WebGLShader} vertexShader Вершинный шейдер.
   * @param {WebGLShader} fragmentShader Фрагментный шейдер.
   */
  public createProgram(shaderVert: WebGLShader, shaderFrag: WebGLShader) {
    this.gpuProgram = this.gl.createProgram()!
    this.gl.attachShader(this.gpuProgram, shaderVert)
    this.gl.attachShader(this.gpuProgram, shaderFrag)
    this.gl.linkProgram(this.gpuProgram)
    this.gl.useProgram(this.gpuProgram)
  }

  /**
   * Устанавливает связь переменной приложения с программой WebGl.
   *
   * @param varType Тип переменной.
   * @param varName Имя переменной.
   */
  public createVariable(varType: WebGlVariableType, varName: string): void {
    if (varType === 'uniform') {
      this.variables[varName] = this.gl.getUniformLocation(this.gpuProgram, varName)
    } else if (varType === 'attribute') {
      this.variables[varName] = this.gl.getAttribLocation(this.gpuProgram, varName)
    }
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
  public createBuffer(buffers: WebGLBuffer[], type: WebGlBufferType, data: TypedArray, key: number): void {

    // Определение индекса нового элемента в массиве буферов WebGL.
    const index = this.splot.buffers.amountOfBufferGroups

    // Создание и заполнение данными нового буфера.
    buffers[index] = this.gl.createBuffer()!
    this.gl.bindBuffer(this.gl[type], buffers[index])
    this.gl.bufferData(this.gl[type], data, this.gl.STATIC_DRAW)

    // Счетчик памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
    this.splot.buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT
  }

  public setVariable(varName: string, varValue: number[]) {
    this.gl.uniformMatrix3fv(this.variables[varName], false, varValue)
  }

  public setBuffer(buffer: WebGLBuffer, varName: string, type: number, size: number, stride: number, offset: number) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.enableVertexAttribArray(this.variables[varName])
    this.gl.vertexAttribPointer(this.variables[varName], size, type, false, stride, offset)
  }

  public draw(first: number, count: number) {
    this.gl.drawArrays(this.gl.POINTS, first, count)
  }
}
