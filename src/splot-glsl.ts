import SPlot from './splot'
import { colorFromHexToGlRgb } from './utils'

/** ****************************************************************************
 *
 * Класс-хелпер, управляющий GLSL-кодом шейдеров.
 */
export default class SPlotGlsl implements SPlotHelper {

  /** Коды шейдеров. */
  public vertex: string = ''
  public fragment: string = ''

  /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
  constructor(
    readonly splot: SPlot
  ) {}

  /** ****************************************************************************
   *
   * Подготавливает хелпер к использованию.
   */
  public setup(): void {

  }

  /** ****************************************************************************
   *
   * Создает дополнение к коду, устанавливающее цвет объекта по индексу цвета.
   *
   * @remarks
   * Т.к. шейдер не позволяет использовать в качестве индексов переменные - для задания цвета используется
   * последовательный перебор цветовых индексов.
   *
   * @returns Код дополнения.
   */
  protected makeColorSource(): string {

    /** Временное добавление в палитру вершин цвета направляющих. */
    this.splot.colors.push(this.splot.grid.rulesColor!)

    let code: string = ''

    /** Формировние кода установки цвета по индексу. */
    this.splot.colors.forEach((value, index) => {
      let [r, g, b] = colorFromHexToGlRgb(value)
      code += `else if (a_color == ${index}.0) v_color = vec3(${r}, ${g}, ${b});\n`
    })

    /** Удаление из палитры вершин временно добавленного цвета направляющих. */
    this.splot.colors.pop()

    /** Удаление лишнего "else" в начале кода. */
    return code.slice(5)
  }
}
