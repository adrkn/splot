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

  private splot: SPlot

  constructor (splot: SPlot) {
    this.splot = splot
  }

  public logIntro(canvas: HTMLCanvasElement): void {
    console.log('%cОтладка SPlot на объекте #' + canvas.id, this.headerStyle)

    if (this.splot.demoMode.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this.groupStyle)
    }

    console.group('%cПредупреждение', this.splot.debug.groupStyle)
    console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль браузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90')
    console.groupEnd()
  }

  public logGpuInfo(gl: WebGLRenderingContext): void {
    console.group('%cВидеосистема', this.groupStyle)
    let ext = gl.getExtension('WEBGL_debug_renderer_info')
    let graphicsCardName = (ext) ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '[неизвестно]'
    console.log('Графическая карта: ' + graphicsCardName)
    console.log('Версия GL: ' + gl.getParameter(gl.VERSION))
    console.groupEnd()
  }

  public logInstanceInfo(canvas: HTMLCanvasElement, options: SPlotOptions): void {
    console.group('%cНастройка параметров экземпляра', this.groupStyle)
    {
      console.dir(this)
      console.log('Пользовательские настройки:\n', jsonStringify(options))
      console.log('Канвас: #' + canvas.id)
      console.log('Размер канваса: ' + canvas.width + ' x ' + canvas.height + ' px')
      console.log('Размер плоскости: ' + this.splot.grid.width + ' x ' + this.splot.grid.height + ' px')

      if (this.splot.demoMode.isEnable) {
        console.log('Способ получения данных: ' + 'демо-данные')
      } else {
        console.log('Способ получения данных: ' + 'итерирование')
      }
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

  public logDataLoadingComplete(amount: number, maxAmount: number): void {
    console.group('%cЗагрузка данных завершена [' + getCurrentTime() + ']', this.groupStyle)
    console.timeEnd('Длительность')
    console.log('Результат: ' +
      ((amount >= maxAmount) ?
      'достигнут заданный лимит (' + maxAmount.toLocaleString() + ')' :
      'обработаны все объекты'))
    console.groupEnd()
  }

  public logObjectStats(buffers: SPlotBuffers, amountOfPolygons: number): void {
    console.group('%cКол-во объектов: ' + amountOfPolygons.toLocaleString(), this.groupStyle)

    for (let i = 0; i < this.splot.shapes.length; i++) {
      const shapeCapction = this.splot.shapes[i].name
      const shapeAmount = buffers.amountOfShapes[i]
      console.log(shapeCapction + ': ' + shapeAmount.toLocaleString() +
        ' [~' + Math.round(100 * shapeAmount / amountOfPolygons) + '%]')
    }

    console.log('Кол-во цветов в палитре: ' + this.splot.polygonPalette.length)
    console.groupEnd()
  }

  public logGpuMemStats(buffers: SPlotBuffers): void {
    let bytesUsedByBuffers = buffers.sizeInBytes[0] + buffers.sizeInBytes[1] + buffers.sizeInBytes[3]

    console.group('%cРасход видеопамяти: ' + (bytesUsedByBuffers / 1000000).toFixed(2).toLocaleString() + ' МБ', this.groupStyle)

    console.log('Буферы вершин: ' +
      (buffers.sizeInBytes[0] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * buffers.sizeInBytes[0] / bytesUsedByBuffers) + '%]')

    console.log('Буферы цветов: '
      + (buffers.sizeInBytes[1] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * buffers.sizeInBytes[1] / bytesUsedByBuffers) + '%]')

    console.log('Буферы размеров: '
      + (buffers.sizeInBytes[3] / 1000000).toFixed(2).toLocaleString() + ' МБ' +
      ' [~' + Math.round(100 * buffers.sizeInBytes[2] / bytesUsedByBuffers) + '%]')

    console.log('Кол-во групп буферов: ' + buffers.amountOfBufferGroups.toLocaleString())
    console.log('Кол-во GL-треугольников: ' + (buffers.amountOfTotalGLVertices / 3).toLocaleString())
    console.log('Кол-во вершин: ' + buffers.amountOfTotalVertices.toLocaleString())

    console.groupEnd()
  }
}
