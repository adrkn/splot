import { randomInt, randomQuotaIndex } from './utils'
import SPlot from './splot'

export default class SPlotDemo {

  public isEnable: boolean = false
  public amount: number = 1_000_000
  public shapeQuota: number[] = []

  private index: number = 0
  private splot: SPlot

  constructor(splot: SPlot) {
    this.splot = splot
    this.prepare()
  }

  public prepare() {
    this.index = 0
  }

  /**
   * Имитирует итерирование исходных объектов.
   *
   * @returns Информация о полигоне или null, если итерирование завершилось.
   */
  public demoIterationCallback(): SPlotPolygon | null {
    if (this.index! < this.amount!) {
      this.index! ++;
      return {
        x: randomInt(this.splot.grid.width!),
        y: randomInt(this.splot.grid.height!),
        shape: randomQuotaIndex(this.shapeQuota!),
        size: 10 + randomInt(21),
        color: randomInt(this.splot.colors.length)
      }
    }
    else {
      this.index = 0
      return null
    }
  }
}
