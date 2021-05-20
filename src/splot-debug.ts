import SPlot from './splot'
import { jsonStringify, getCurrentTime } from './utils'

/**
 * Тип для параметров режима отладки.
 *
 * @param isEnable - Признак включения отладочного режима.
 * @param output - Место вывода отладочной информации.
 * @param headerStyle - Стиль для заголовка всего отладочного блока.
 * @param groupStyle - Стиль для заголовка группировки отладочных данных.
 *
 * @todo Реализовать дополнительные места вывода output: 'console' | 'document' | 'file'
 */
export default class SPlotDebug {

  public isEnable: boolean = false
  public headerStyle: string = 'font-weight: bold; color: #ffffff; background-color: #cc0000;'
  public groupStyle: string = 'font-weight: bold; color: #ffffff;'

  public logIntro(splot: SPlot, canvas: HTMLCanvasElement): void {
    console.log('%cОтладка SPlot на объекте #' + canvas.id, this.headerStyle)

    if (splot.demo.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this.groupStyle)
    }

    console.group('%cПредупреждение', this.groupStyle)
    console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90')
    console.groupEnd()
  }

  public logGpuInfo(hardware: string, software: string): void {
    console.group('%cВидеосистема', this.groupStyle)
    console.log('Графическая карта: ' + hardware)
    console.log('Версия GL: ' + software)
    console.groupEnd()
  }

  public logInstanceInfo(splot: SPlot, canvas: HTMLCanvasElement, options: SPlotOptions): void {

    console.group('%cНастройка параметров экземпляра', this.groupStyle)
    console.dir(splot)
    console.log('Пользовательские настройки:\n', jsonStringify(options))
    console.log('Канвас: #' + canvas.id)
    console.log('Размер канваса: ' + canvas.width + ' x ' + canvas.height + ' px')
    console.log('Размер плоскости: ' + splot.grid.width + ' x ' + splot.grid.height + ' px')

    if (splot.demo.isEnable) {
      console.log('Способ получения данных: ' + 'демо-данные')
    } else {
      console.log('Способ получения данных: ' + 'итерирование')
    }
    console.groupEnd()
  }

  public logShaderInfo(shaderType: string, shaderCode: string, ): void {
    console.group('%cСоздан шейдер [' + shaderType + ']', this.groupStyle)
    console.log(shaderCode)
    console.groupEnd()
  }

  public logDataLoadingStart(): void {
    console.log('%cЗапущен процесс загрузки данных [' + getCurrentTime() + ']...', this.groupStyle)
    console.time('Длительность')
  }

  public logDataLoadingComplete(counter: number, limit: number): void {
    console.group('%cЗагрузка данных завершена [' + getCurrentTime() + ']', this.groupStyle)
    console.timeEnd('Длительность')
    console.log('Результат: ' +
      ((counter >= limit) ?
      'достигнут заданный лимит (' + limit.toLocaleString() + ')' :
      'обработаны все объекты'))
    console.groupEnd()
  }

  public logObjectStats(splot: SPlot, objectCounter: number): void {
    console.group('%cКол-во объектов: ' + objectCounter.toLocaleString(), this.groupStyle)

    for (let i = 0; i < splot.shapes.length; i++) {
      const shapeCapction = splot.shapes[i].name
      /*const shapeAmount = buffers.amountOfShapes[i]
      console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
        ' [~' + Math.round(100 * shapeAmount / objectCounter) + '%]')*/
    }

    console.log('Кол-во цветов в палитре: ' + splot.colors.length)
    console.groupEnd()
  }

  public logGpuMemStats(stats: any): void {

    console.group('%cРасход видеопамяти: ' + (stats.bytes / 1000000).toFixed(2).toLocaleString() + ' МБ', this.groupStyle)
    /*console.log('Кол-во групп буферов: ' + buffers.amountOfBufferGroups.toLocaleString())
    console.log('Кол-во GL-треугольников: ' + (buffers.amountOfTotalGLVertices / 3).toLocaleString())
    console.log('Кол-во вершин: ' + buffers.amountOfTotalVertices.toLocaleString())*/

    console.groupEnd()
  }

  public logRenderStarted() {
    console.log('%cРендеринг запущен', this.groupStyle)
  }

  public logRenderStoped() {
    console.log('%cРендеринг остановлен', this.groupStyle)
  }

  public logCanvasCleared(color: string) {
    console.log('%cКонтекст рендеринга очищен [' + color + ']', this.groupStyle);
  }
}
