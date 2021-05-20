import { randomInt } from './utils'
import SPlot from './splot'

export default class SPlotDemo {

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

  /** Счетчик итерируемых объектов. */
  private index: number = 0

  constructor(
    private readonly splot: SPlot
  ) {}

  /** Подготовка к использованию демо-режима. */
  public prepare(): void {
    this.index = 0
  }

  /** Имитация итератора исходных объектов. */
  public iterator(): SPlotObject | null {
    if (this.index < this.amount) {
      this.index++
      return {
        x: randomInt(this.splot.grid.width!),
        y: randomInt(this.splot.grid.height!),
        shape: randomInt(this.splot.shapesCount),
        size: this.sizeMin + randomInt(this.sizeMax - this.sizeMin + 1),
        color: randomInt(this.colors.length)
      }
    }
    else {
      return null
    }
  }
}
