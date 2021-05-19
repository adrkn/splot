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

  constructor(splot: SPlot) {
    this.splot = splot
  }

  /**
   * Создает контекст рендеринга WebGL и устанавливает корректный размер области просмотра.
   */
  public create(): void {

    this.splot.gl = this.splot.canvas.getContext('webgl', this.webGlSettings)!

    this.splot.canvas.width = this.splot.canvas.clientWidth
    this.splot.canvas.height = this.splot.canvas.clientHeight

    this.splot.gl.viewport(0, 0, this.splot.canvas.width, this.splot.canvas.height)
  }

  public setBgColor(color: string) {
    let [r, g, b] = colorFromHexToGlRgb(color)
    this.splot.gl.clearColor(r, g, b, 0.0)
  }

  public clearBackground() {
    this.splot.gl.clear(this.splot.gl.COLOR_BUFFER_BIT);
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
    const shader = this.splot.gl.createShader(this.splot.gl[shaderType])!
    this.splot.gl.shaderSource(shader, shaderCode)
    this.splot.gl.compileShader(shader)

    if (!this.splot.gl.getShaderParameter(shader, this.splot.gl.COMPILE_STATUS)) {
      throw new Error('Ошибка компиляции шейдера [' + shaderType + ']. ' + this.splot.gl.getShaderInfoLog(shader))
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
    this.splot.gpuProgram = this.splot.gl.createProgram()!
    this.splot.gl.attachShader(this.splot.gpuProgram, shaderVert)
    this.splot.gl.attachShader(this.splot.gpuProgram, shaderFrag)
    this.splot.gl.linkProgram(this.splot.gpuProgram)
    this.splot.gl.useProgram(this.splot.gpuProgram)
  }

  /**
   * Устанавливает связь переменной приложения с программой WebGl.
   *
   * @param varType Тип переменной.
   * @param varName Имя переменной.
   */
  public createVariable(varType: WebGlVariableType, varName: string): void {
    if (varType === 'uniform') {
      this.splot.variables[varName] = this.splot.gl.getUniformLocation(this.splot.gpuProgram, varName)
    } else if (varType === 'attribute') {
      this.splot.variables[varName] = this.splot.gl.getAttribLocation(this.splot.gpuProgram, varName)
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
    buffers[index] = this.splot.gl.createBuffer()!
    this.splot.gl.bindBuffer(this.splot.gl[type], buffers[index])
    this.splot.gl.bufferData(this.splot.gl[type], data, this.splot.gl.STATIC_DRAW)

    // Счетчик памяти, занимаемой буферами данных (раздельно по каждому типу буферов)
    this.splot.buffers.sizeInBytes[key] += data.length * data.BYTES_PER_ELEMENT
  }

  public setVariable(varName: WebGLUniformLocation, varValue: number[]) {
    this.splot.gl.uniformMatrix3fv(varName, false, varValue)
  }

  public setBuffer(buffer: WebGLBuffer, varName: number, type: number, size: number, stride: number, offset: number) {
    this.splot.gl.bindBuffer(this.splot.gl.ARRAY_BUFFER, buffer)
    this.splot.gl.enableVertexAttribArray(varName)
    this.splot.gl.vertexAttribPointer(varName, size, type, false, stride, offset)
  }

  public draw(first: number, count: number) {
    this.splot.gl.drawArrays(this.splot.gl.POINTS, first, count)
  }
}
