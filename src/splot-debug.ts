import SPlot from './splot'
import { jsonStringify, getCurrentTime } from './utils'

/**
 * Тип для параметров режима отладки.
 *
 * @param isEnable - Признак включения отладочного режима.
 * @param headerStyle - Стиль для заголовка всего отладочного блока.
 * @param groupStyle - Стиль для заголовка группировки отладочных данных.
 *
 * @todo Реализовать дополнительные места вывода output: 'console' | 'document' | 'file'
 */
export default class SPlotDebug {

  /** Признак активации режим отладки. */
  public isEnable: boolean = false

  /** Стиль заголовка режима отладки. */
  public headerStyle: string = 'font-weight: bold; color: #ffffff; background-color: #cc0000;'

  /** Стиль заголовка группы параметров. */
  public groupStyle: string = 'font-weight: bold; color: #ffffff;'

  constructor(
    private readonly splot: SPlot
  ) {}

  /** Подготовка к использованию отладочного режима. */
  public prepare(clearConsole: boolean = false): void {
    if (clearConsole) {
      console.clear()
    }
  }

  public logIntro(): void {
    console.log('%cОтладка SPlot на объекте #' + this.splot.webgl.canvas.id, this.headerStyle)

    if (this.splot.demo.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this.groupStyle)
    }

    console.group('%cПредупреждение', this.groupStyle)
    console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90')
    console.groupEnd()
  }

  public logGpuInfo(): void {
    console.group('%cВидеосистема', this.groupStyle)
    console.log('Графическая карта: ' + this.splot.webgl.gpu.hardware)
    console.log('Версия GL: ' + this.splot.webgl.gpu.software)
    console.groupEnd()
  }

  public logInstanceInfo(): void {

    console.group('%cНастройка параметров экземпляра', this.groupStyle)
    console.dir(this.splot)
    console.log('Канвас: #' + this.splot.webgl.canvas.id)
    console.log('Размер канваса: ' + this.splot.webgl.canvas.width + ' x ' + this.splot.webgl.canvas.height + ' px')
    console.log('Размер плоскости: ' + this.splot.grid.width + ' x ' + this.splot.grid.height + ' px')

    if (this.splot.demo.isEnable) {
      console.log('Способ получения данных: ' + 'демо-данные')
    } else {
      console.log('Способ получения данных: ' + 'итерирование')
    }
    console.groupEnd()
  }

  public logShadersInfo(): void {
    console.group('%cСоздан вершинный шейдер: ', this.groupStyle)
    console.log(this.splot.shaderCodeVert)
    console.groupEnd()
    console.group('%cСоздан фрагментный шейдер: ', this.groupStyle)
    console.log(this.splot.shaderCodeFrag)
    console.groupEnd()
  }

  public logDataLoadingStart(): void {
    console.log('%cЗапущен процесс загрузки данных [' + getCurrentTime() + ']...', this.groupStyle)
    console.time('Длительность')
  }

  public logDataLoadingComplete(): void {
    console.group('%cЗагрузка данных завершена [' + getCurrentTime() + ']', this.groupStyle)
    console.timeEnd('Длительность')
    console.log('Расход видеопамяти: ' + (this.splot.stats.memUsage / 1000000).toFixed(2).toLocaleString() + ' МБ')
    console.log('Кол-во объектов: ' + this.splot.stats.objectsCountTotal.toLocaleString())
    console.log('Кол-во групп буферов: ' + this.splot.stats.groupsCount.toLocaleString())
    console.log('Результат: ' + ((this.splot.stats.objectsCountTotal >= this.splot.globalLimit) ?
      'достигнут лимит объектов (' + this.splot.globalLimit.toLocaleString() + ')' :
      'обработаны все объекты'))
    console.groupEnd()
  }

  public logRenderStarted() {
    console.log('%cРендер запущен', this.groupStyle)
  }

  public logRenderStoped() {
    console.log('%cРендер остановлен', this.groupStyle)
  }

  public logCanvasCleared(color: string) {
    console.log('%cКонтекст рендеринга очищен [' + color + ']', this.groupStyle);
  }
}
