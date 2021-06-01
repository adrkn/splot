import SPlot from '@/splot'
import * as shaders from '@/shaders'
import { colorFromHexToGlRgb } from '@/utils'

/** ****************************************************************************
 *
 * Класс-хелпер, управляющий GLSL-кодом шейдеров.
 */
export default class SPlotGlsl implements SPlotHelper {

  /** Коды шейдеров. */
  public vertShaderSource: string = ''
  public fragShaderSource: string = ''

  /** Признак того, что хелпер уже настроен. */
  public isSetuped: boolean = false

  /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
  constructor(
    readonly splot: SPlot
  ) {}

  /** ****************************************************************************
   *
   * Подготавливает хелпер к использованию.
   */
  public setup(): void {

    if (!this.isSetuped) {

      /** Сборка кодов шейдеров. */
      this.vertShaderSource = this.makeVertShaderSource()
      this.fragShaderSource = this.makeFragShaderSource()

      /** Вычисление количества различных форм объектов. */
      this.splot.shapesCount = shaders.SHAPES.length

      this.isSetuped = true
    }
  }

  /** ****************************************************************************
   *
   * Создает код вершинного шейдера.
   *
   * @remarks
   * В шаблон вершинного шейдера вставляется код выбора цвета объекта по индексу цвета. Т.к.шейдер не позволяет
   * использовать в качестве индексов переменные - для задания цвета используется последовательный перебор цветовых
   * индексов. Место вставки кода обозначается в шаблоне вершинного шейдера словом "{COLOR-SELECTION}".
   *
   * @returns Строка с кодом.
   */
  private makeVertShaderSource(): string {

    /** Временное добавление в палитру вершин цвета направляющих. */
    this.splot.colors.push(this.splot.grid.guideColor!)

    let code: string = ''

    /** Формировние кода установки цвета объекта по индексу. */
    this.splot.colors.forEach((value, index) => {
      let [r, g, b] = colorFromHexToGlRgb(value)
      code += `else if (a_color == ${index}.0) v_color = vec3(${r}, ${g}, ${b});\n`
    })

    /** Удаление из палитры вершин временно добавленного цвета направляющих. */
    this.splot.colors.pop()

    /** Удаление лишнего "else" в начале кода и лишнего перевода строки в конце. */
    code = code.slice(5).slice(0, -1)

    return shaders.VERTEX_TEMPLATE.replace('{COLOR-SELECTION}', code).trim()
  }

  /** ****************************************************************************
   *
   * Создает код фрагментного шейдера.
   *
   * @remarks
   * В шаблон фрагментного шейдера вставляется код выбора формы объекта по индексу формы. Т.к.шейдер не позволяет
   * использовать в качестве индексов переменные - для задания формы используется последовательный перебор индексов
   * форм. Каждая форма описывается функцией, которые создаются из перечисляемых GLSL-алгоритмов (константы SHAPES).
   * Место вставки кода функций в шаблоне фрагментного шейдера обозначается словом "{SHAPES-FUNCTIONS}". Место вставки
   * перебора индексов форм обозначается словом "{SHAPE-SELECTION}".
   *
   * @returns Строка с кодом.
   */
  private makeFragShaderSource(): string {

    let code1: string = ''
    let code2: string = ''

    shaders.SHAPES.forEach((value, index) => {

      /** Формирование кода функций, описывающих формы объектов. */
      code1 += `void s${index}() { ${value.trim()} }\n`

      /** Формирование кода установки формы объекта по индексу. */
      code2 += `else if (v_shape == ${index}.0) { s${index}();}\n`
    })

    /** Удаление лишнего перевода строки в конце кода функций. */
    code1 = code1.slice(0, -1)

    /** Удаление лишнего "else" в начале кода перебора и лишнего перевода строки в конце кода. */
    code2 = code2.slice(5).slice(0, -1)

    return shaders.FRAGMENT_TEMPLATE.
      replace('{SHAPES-FUNCTIONS}', code1).
      replace('{SHAPE-SELECTION}', code2).
      trim()
  }
}
