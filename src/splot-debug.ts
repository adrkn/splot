import SPlot from '@/splot'
import { getCurrentTime } from '@/utils'

/** ****************************************************************************
 *
 * Класс-хелпер, реализующий поддержку режима отладки для класса SPlot.
 */
export default class SPlotDebug implements SPlotHelper {

  /** Признак активации режим отладки. */
  public isEnable: boolean = false

  /** Стиль заголовка режима отладки. */
  public headerStyle: string = 'font-weight: bold; color: #ffffff; background-color: #cc0000;'

  /** Стиль заголовка группы параметров. */
  public groupStyle: string = 'font-weight: bold; color: #ffffff;'

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
  public setup(clearConsole: boolean = false): void {

    if (!this.isSetuped) {

      if (clearConsole) {
        console.clear()
      }

      this.isSetuped = true
    }
  }

  /** ****************************************************************************
   *
   * Выводит в консоль отладочную информацию, если включен режим отладки.
   *
   * @remarks
   * Отладочная информация выводится блоками. Названия блоков передаются в метод перечислением строк. Каждая строка
   * интерпретируется как имя метода. Если нужные методы вывода блока существуют - они вызываются. Если метода с нужным
   * названием не существует - генерируется ошибка.
   *
   * @param logItems - Перечисление строк с названиями отладочных блоков, которые нужно отобразить в консоли.
   */
  public log(...logItems: string[]): void {
    if (this.isEnable) {
      logItems.forEach(item => {
        if (typeof (this as any)[item] === 'function') {
          (this as any)[item]()
        } else {
          throw new Error('Отладочного блока ' + item + '" не существует!')
        }
      })
    }
  }

  /** ****************************************************************************
   *
   * Выводит сообщение об ошибке.
   */
  public error(message: string): void {
    if (this.isEnable) {
      console.error(message)
    }
  }

  /** ****************************************************************************
   *
   * Выводит вступительную часть о режиме отладки.
   */
  public intro(): void {
    console.log('%cОтладка SPlot на объекте #' + this.splot.canvas.id, this.headerStyle)

    if (this.splot.demo.isEnable) {
      console.log('%cВключен демонстрационный режим данных', this.groupStyle)
    }

    console.group('%cПредупреждение', this.groupStyle)
    console.log('Открытая консоль браузера и другие активные средства контроля разработки существенно снижают производительность высоконагруженных приложений. Для объективного анализа производительности все подобные средства должны быть отключены, а консоль брzаузера закрыта. Некоторые данные отладочной информации в зависимости от используемого браузера могут не отображаться или отображаться некорректно. Средство отладки протестировано в браузере Google Chrome v.90')
    console.groupEnd()
  }

  /** ****************************************************************************
   *
   * Выводит информацию о графической системе клиента.
   */
  public gpu(): void {
    console.group('%cВидеосистема', this.groupStyle)
    console.log('Графическая карта: ' + this.splot.webgl.gpu.hardware)
    console.log('Версия GL: ' + this.splot.webgl.gpu.software)
    console.groupEnd()
  }

  /** ****************************************************************************
   *
   * Выводит информация о текущем экземпляре класса SPlot.
   */
  public instance(): void {

    console.group('%cНастройка параметров экземпляра', this.groupStyle)
    console.dir(this.splot)
    console.log('Размер канваса: ' + this.splot.canvas.width + ' x ' + this.splot.canvas.height + ' px')

    if (this.splot.demo.isEnable) {
      console.log('Способ получения данных: ' + 'демо-данные')
    } else {
      console.log('Способ получения данных: ' + 'итерирование')
    }
    console.groupEnd()
  }

  /** ****************************************************************************
   *
   * Выводит коды шейдеров.
   */
  public shaders(): void {
    console.group('%cСоздан вершинный шейдер: ', this.groupStyle)
    console.log(this.splot.glsl.vertShaderSource)
    console.groupEnd()
    console.group('%cСоздан фрагментный шейдер: ', this.groupStyle)
    console.log(this.splot.glsl.fragShaderSource)
    console.groupEnd()
  }

  /** ****************************************************************************
   *
   * Выводит сообщение о начале процессе загрузки данных.
   */
  public loading(): void {
    console.log('%cЗапущен процесс загрузки данных [' + getCurrentTime() + ']...', this.groupStyle)
    console.time('Длительность')
  }

  /** ****************************************************************************
   *
   * Выводит статистику по завершении процесса загрузки данных.
   */
  public loaded(): void {
    console.group('%cЗагрузка данных завершена [' + getCurrentTime() + ']', this.groupStyle)
    console.timeEnd('Длительность')
    console.log('Расход видеопамяти: ' + (this.splot.stats.memUsage / 1000000).toFixed(2).toLocaleString() + ' МБ')
    console.log('Кол-во объектов: ' + this.splot.stats.objTotalCount.toLocaleString())
    console.log('Создано видеобуферов: ' + this.splot.stats.groupsCount.toLocaleString())
    console.log(`Группировка видеобуферов: ${this.splot.area.count} x ${this.splot.area.count}`)
    console.log(`Шаг деления на группы: ${this.splot.area.step}`)
    console.log('Результат: ' + ((this.splot.stats.objTotalCount >= this.splot.globalLimit) ?
      'достигнут лимит объектов (' + this.splot.globalLimit.toLocaleString() + ')' :
      'обработаны все объекты'))
    console.groupEnd()
  }

  /** ****************************************************************************
   *
   * Выводит сообщение о запуске рендера.
   */
  public started(): void {
    console.log('%cРендер запущен', this.groupStyle)
  }

  /** ****************************************************************************
   *
   * Выводит сообщение об остановке рендера.
   */
  public stoped(): void {
    console.log('%cРендер остановлен', this.groupStyle)
  }

  /** ****************************************************************************
   *
   * Выводит сообшение об очистке области рендера.
   */
  public cleared(color: string): void {
    console.log('%cОбласть рендера очищена [' + color + ']', this.groupStyle);
  }
}
