import { randomInt, randomQuotaIndex } from './utils'

export default class SPlotDemo {

  public isEnable: boolean = false
  public amount: number = 1_000_000
  public shapeQuota: number[] = []
  public sizeMin: number = 10
  public sizeMax: number = 30

  public colors: string[] = [
    '#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00',
    '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1'
  ]

  private grid!: SPlotGrid
  private index: number = 0

  public prepare(grid: SPlotGrid): void {
    this.grid = grid
    this.index = 0
  }

  /**
   * Имитирует итерирование исходных объектов.
   *
   * @returns Информация о полигоне или null, если итерирование завершилось.
   */
  public iterator(): SPlotObject | null {
    if (this.index! < this.amount!) {
      this.index! ++;
      return {
        x: randomInt(this.grid.width!),
        y: randomInt(this.grid.height!),
        shape: randomQuotaIndex(this.shapeQuota!),
        size: this.sizeMin + randomInt(this.sizeMax - this.sizeMin + 1),
        color: randomInt(this.colors.length)
      }
    }
    else {
      this.index = 0
      return null
    }
  }
}
