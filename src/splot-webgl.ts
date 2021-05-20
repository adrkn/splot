import { colorFromHexToGlRgb } from './utils'

export default class SPlotWebGl {

  public alpha: boolean = false
  public depth: boolean = false
  public stencil: boolean = false
  public antialias: boolean = false
  public desynchronized: boolean = false
  public premultipliedAlpha: boolean = false
  public preserveDrawingBuffer: boolean = false
  public failIfMajorPerformanceCaveat: boolean = false
  public powerPreference: WebGLPowerPreference = 'high-performance'

  public gpu = { hardware: '', software: '' }
  public canvas!: HTMLCanvasElement
  public gl!: WebGLRenderingContext
  private gpuProgram!: WebGLProgram

  private variables: Map<string, any> = new Map()

  public data: Map<string, {buffers: WebGLBuffer[], type: number}> = new Map()

  private glNumberTypes: Map<string, number> = new Map()

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

    this.gl = this.canvas.getContext('webgl', {
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

    let ext = this.gl.getExtension('WEBGL_debug_renderer_info')
    this.gpu.hardware = (ext) ? this.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]'
    this.gpu.software = this.gl.getParameter(this.gl.VERSION)

    this.glNumberTypes.set('Float32Array', this.gl.FLOAT)
    this.glNumberTypes.set('Uint8Array', this.gl.UNSIGNED_BYTE)
    this.glNumberTypes.set('Uint16Array', this.gl.UNSIGNED_SHORT)
    this.glNumberTypes.set('Int8Array', this.gl.BYTE)
    this.glNumberTypes.set('Int16Array', this.gl.SHORT)

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
  public createShader(shaderType: 'VERTEX_SHADER' | 'FRAGMENT_SHADER', shaderCode: string): WebGLShader {

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
  public createProgramFromShaders(shaderVert: WebGLShader, shaderFrag: WebGLShader): void {
    this.gpuProgram = this.gl.createProgram()!
    this.gl.attachShader(this.gpuProgram, shaderVert)
    this.gl.attachShader(this.gpuProgram, shaderFrag)
    this.gl.linkProgram(this.gpuProgram)
    this.gl.useProgram(this.gpuProgram)
  }

  public createProgram(shaderCodeVert: string, shaderCodeFrag: string): void {
    this.createProgramFromShaders(
      this.createShader('VERTEX_SHADER', shaderCodeVert),
      this.createShader('FRAGMENT_SHADER', shaderCodeFrag)
    )
  }

  /**
   * Устанавливает связь переменной приложения с программой WebGl.
   *
   * @param varType Тип переменной.
   * @param varName Имя переменной.
   */
  public createVariable(varName: string): void {

    const varType = varName.slice(0, 2)

    if (varType === 'u_') {
      this.variables.set(varName, this.gl.getUniformLocation(this.gpuProgram, varName))
    } else if (varType === 'a_') {
      this.variables.set(varName, this.gl.getAttribLocation(this.gpuProgram, varName))
    } else {
      throw new Error('Не указан тип (префикс) переменной шейдера: ' + varName)
    }
  }

  public createVariables(...varNames: string[]): void {
    varNames.forEach(varName => this.createVariable(varName));
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
  public createBuffer(groupName: string, data: TypedArray): number {

    const buffer = this.gl.createBuffer()!
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW)

    if (!this.data.has(groupName)) {
      this.data.set(groupName, { buffers: [], type: this.glNumberTypes.get(data.constructor.name)!})
    }

    this.data.get(groupName)!.buffers.push(buffer)

    return data.length * data.BYTES_PER_ELEMENT
  }

  public setVariable(varName: string, varValue: number[]) {
    this.gl.uniformMatrix3fv(this.variables.get(varName), false, varValue)
  }

  public setBuffer(groupName: string, index: number, varName: string, size: number, stride: number, offset: number) {
    const group = this.data.get(groupName)!
    const variable = this.variables.get(varName)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, group.buffers[index])
    this.gl.enableVertexAttribArray(variable)
    this.gl.vertexAttribPointer(variable, size, group.type, false, stride, offset)
  }

  public drawPoints(first: number, count: number) {
    this.gl.drawArrays(this.gl.POINTS, first, count)
  }
}
