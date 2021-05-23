import SPlot from './splot'
import * as shaders from './shaders'
import { colorFromHexToGlRgb } from './utils'

/** ****************************************************************************
 *
 * Класс-хелпер, управляющий GLSL-кодом шейдеров.
 */
export default class SPlotGlsl implements SPlotHelper {

  /** Коды шейдеров. */
  public vertShaderSource: string = ''
  public fragShaderSource: string = ''

  /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
  constructor(
    readonly splot: SPlot
  ) {}

  /** ****************************************************************************
   *
   * Подготавливает хелпер к использованию.
   */
  public setup(): void {

    /** Сборка кодов шейдеров. */
    this.vertShaderSource = this.makeVertShaderSource()
    this.fragShaderSource = this.makeFragShaderSource()

    /** Вычисление количества различных форм объектов. */
    this.splot.shapesCount = shaders.SHAPES.length
  }

  /** ****************************************************************************
   *
   * Создает код вершинного шейдера.
   *
   * @remarks
   * В шаблон вершинного шейдера вставляется код выбора цвета объекта по индексу цвета. Т.к.шейдер не позволяет
   * использовать в качестве индексов переменные - для задания цвета используется последовательный перебор цветовых
   * индексов.
   */
  private makeVertShaderSource() {

    /** Временное добавление в палитру вершин цвета направляющих. */
    this.splot.colors.push(this.splot.grid.rulesColor!)

    let code: string = ''

    /** Формировние кода установки цвета объекта по индексу. */
    this.splot.colors.forEach((value, index) => {
      let [r, g, b] = colorFromHexToGlRgb(value)
      code += `else if (a_color == ${index}.0) v_color = vec3(${r}, ${g}, ${b});\n`
    })

    /** Удаление из палитры вершин временно добавленного цвета направляющих. */
    this.splot.colors.pop()

    /** Удаление лишнего "else" в начале кода. */
    code = code.slice(5)

    return shaders.VERTEX_TEMPLATE.replace('{COLOR-CODE}', code).trim()
  }

  /** ****************************************************************************
   *
   * Создает код фрагментного шейдера.
   */
  private makeFragShaderSource() {

    let code: string = ''

    /** Формировние кода установки формы объекта по индексу. */
    shaders.SHAPES.forEach((value, index) => {
      code += `else if (v_shape == ${index}.0) {\n ${value.trim()}\n} `
    })

    /** Удаление лишнего "else" в начале кода. */
    code = code.slice(5)

    return shaders.FRAGMENT_TEMPLATE.replace('{SHAPE-CODE}', code).trim()
  }
}
