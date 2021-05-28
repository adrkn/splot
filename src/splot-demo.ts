import SPlot from '@/splot'
import { randomInt } from '@/utils'

/** ****************************************************************************
 *
 * Класс-хелпер, реализующий поддержку режима демонстрационных данных для класса SPlot.
 */
export default class SPlotDemo implements SPlotHelper {

  /** Признак активации демо-режима. */
  public isEnable: boolean = false

  /** Количество бъектов. */
  public amount: number = 1_000_000

  /** Минимальный размер объектов. */
  public sizeMin: number = 10

  /** Максимальный размер объектов. */
  public sizeMax: number = 30

  /** Цветовая палитра объектов. */
  public colors: string[] = [
    '#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00',
    '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'
  ]

  /** Признак того, что хелпер уже настроен. */
  public isSetuped: boolean = false

  /** Счетчик итерируемых объектов. */
  private index: number = 0

  /** Хелпер будет иметь полный доступ к экземпляру SPlot. */
  constructor(
    readonly splot: SPlot
  ) {}

  /** ****************************************************************************
   *
   * Подготавливает хелпер к использованию.
   */
  public setup(): void {

    /** Хелпер демо-режима выполняет настройку всех своих параметров даже если она уже выполнялась. */
    if (!this.isSetuped) {
      this.isSetuped = true
    }

    /** Обнуление счетчика итератора. */
    this.index = 0

    /** Подготовка демо-режима (если требуется). */
    if (this.splot.demo.isEnable) {
      this.splot.iterator = this.splot.demo.iterator.bind(this)
      this.splot.colors = this.splot.demo.colors
    }
  }

  /** ****************************************************************************
   *
   * Имитирует итератор исходных объектов.
   */
  public iterator(): SPlotObject | null {
    if (this.index < this.amount) {
      this.index++
      return {
        x: Math.random(),
        y: Math.random(),
        shape: randomInt(this.splot.shapesCount!),
        size: this.sizeMin + randomInt(this.sizeMax - this.sizeMin + 1),
        color: randomInt(this.colors.length)
      }
    }
    else {
      return null
    }
  }
}
