![](https://img.shields.io/badge/lang-TypeScript-blue)
![](https://img.shields.io/badge/lang-GLSL_1.0-blue)
![](https://img.shields.io/badge/WebGL_1.0-OpenGL_ES_2.0-008100)


# **Диаграмма рассеяния SPlot**

SPlot (*Scatter Plot, Super Plot*) - функционал реализующий диаграмму рассеяния (график скаттерплот) средствами WebGL.

Демонстрация работы: <https://splot.mariekit.ru>

# Возможности

- Позволяет корректно, без "лагов" отображать **десятки миллионов объектов**.
- График можно двигать и семантически зумировать без "фризов".
- Каждый отображаемый объект кроме места расположения может иметь индивидуальную форму, размер и цвет.
- Можно создавать собственные формы объектов.
- Присутствуют демо-режим и режим отладки.
- Сторонние библиотеки не используются.


# Подключение

Экземпляр класса привязывается к существующему в документе канвасу по идентификатору. Настройка происходит передачей опций (в примерах - переменная `options`) одним из перечисленных ниже способов. Результатом будет отрисовка на канвасе скаттерплота.

```js
// Подключение модуля с классом SPlot
import SPlot from 'splot'
```

```js
// Способ с разделением этапов создания, настройки и отрисовки.

let splot = new SPlot('canvas-id')
splot.setup(options)
splot.run()
```

```js
// Способ с объединением этапа создания и настройки.

let splot = new SPlot('canvas-id', options)
splot.run()
```

```js
// Способ с объединением этапов создания, настройки и отрисовки. Требуется указание соответствующего параметра в опциях.

let splot = new SPlot('canvas-id', options)
```

```js
// Вариант предварителного формирования опций для предыдущего примера.

let options = {
  iterator: readNextObject,
  colors: ['#ff0000', '#00ff00', '#0000ff'],
  forceRun: true
}
```


# Настройка

Опции экземпляра передаются объектом в json-стилистике. Основной параметр опций - [данные об объектах](#objectdata) скаттерплота (расположение, форма, размер и цвет точек). Загрузить в скаттерплот данные об объектах можно двумя способами.

1. Задание в опциях параметра `iterator`. В качестве значения передается итерирующая функция.

2. Задание в опциях параметра `data`. В качестве значения передается готовый массив с данными об объектах.
Для корректной работы скаттерплота во время его первой настройки необходимо использовать один из этих способов загрузки данных. При повторных настройках задание способа загрузки требуется только если параметр `loadData` установлен в значение `true`.

Если будут заданы одновременно оба способа загрузки данных, то данные будут загружаться из массива.

> Для удобства описания составные параметры указаны в таблице через точку. Однако передавать опции экземпляру класса необходимо в json-стилистике как в предыдущем примере.


<a name="options"></a>
## Опции скаттерплота (SPlotOptions)

Данные опции указываются в json-стилистике при создании, при настройке или перенастройке скаттерплота. Также эти опции доступны в качестве свойств экземпляра SPlot, но в таком режиме они доступны только для чтения.

| Параметр | По умолчанию | Описание |
| - | - |- |
| `iterator` | `undefined` | Итерирующая функция. Каждый вызов этой функции должен возвращать либо данные об очередном объекте, либо null, если все объекты обработаны. Данные об объекте должны возвращаться в виде специальной [записи](#objectdata). |
| `data` | `undefined` | Массив с данными об объектах. Каждый элемент массива должен быть [записью](#objectdata) специального вида. |
| `colors` | `[ ]` | Цветовая палитра объектов в виде массива строк. Каждая строка - это HEX-запись цвета. Индексы этого массива используются в данных об объектах. Обязательный параметр для первичной настройки скаттерплота. |
| `grid {}` |  | Параметры координатной плоскости. |
| `grid.bgColor` | `"#ffffff"`  | Фоновый цвет скаттерплота в HEX-формате. Следует делать его равным фоновому цвету канваса. |
| `grid.guideColor` | `"#c0c0c0"`  | Цвет направляющих координатной плоскости скаттерплота в HEX-формате. |
| `forceRun` | `false`  | Признак форсированного запуска рендера. Если значение параметра будет `true`, то скаттерплот будет запущен сразу же после применения опций. |
| `globalLimit` | `1_000_000_000`  | Максимальное количество объектов, которое будет отображать скаттерплот. Если в процессе загрузки данных об объектах будет превышен этот лимит, то оставшиеся объекты не попадут в скаттерплот. |
| `camera {}` |  | Начальное состояние видимости плоскости скаттерплота на канвасе. |
| `camera.x` | `<центр графика>`  | Положение области просмотра по оси X. Может принимать значения в пределах от 0 до 1. |
| `camera.y` | `<центр графика>`  | Положение области просмотра по оси Y. Может принимать значения в пределах от 0 до 1. |
| `camera.zoom` | `<весь график помещается на канвасе>`  | Условное значение зумирования скаттерплота. Может изменяться в пределах от 1 до 10 000 000 единиц. |
| `loadData` | `true`  | Признак необходимости загрузки данных в скаттерплот. Для первичной настройки скаттерплота загрузка данных является обязательной. При последующих настройках и необходимости новой загрузки данных этот параметр должен быть принудительно установлен в значение `true`, т.к. после каждой загрузки данных скаттерплот сбрасывает его значение в `false`, чтобы не загружать данные повторно. |
| `demo {}` |  | Параметры режима демонстрационных данных. В этом режиме параметры `iterator`, `data` и `colors` игнорируются. Скаттерплот формирует и загружает искусственно сгенерированные объекты со случайными характеристиками. |
| `demo.isEnable` | `false`  | Признак включения демо-режима. |
| `demo.amount` | `1_000_000`  | Количество демо-объектов. |
| `demo.sizeMin` | `10`  | Минимальный размер демо-объектов. |
| `demo.sizeMax` | `30`  | Максимальный размер демо-объектов. |
| `demo.colors` | `["#D81C01", "#E9967A", "#BA55D3", "#FFD700", "#FFE4B5", "#FF8C00", "#228B22", "#90EE90", "#4169E1", "#00BFFF", "#8B4513", "#00CED1"]`  | Цветовая палитра демо-объектов в виде массива строк, описывающих цвета в HEX-формате. |
| `debug {}` |  | Параметры режима отладки. В этом режиме в консоль браузера выводится подробная техническая информация о данных и процессах скаттерплота. В этом режиме производительность скаттерплота значительно снижается. |
| `debug.isEnable` | `false`  | Признак включения режима отладки. |
| `debug.headerStyle` | `"font-weight: bold; color: #ffffff; background-color: #cc0000;"`  | CSS-стиль основного заголовка режима отладки в виде строки. |
| `debug.groupStyle` | `"font-weight: bold; color: #ffffff;"`  | CSS-стиль заголовка группы параметров режима отладки в виде строки. |


## Опции WebGL

Данные опции указываются в json-стилистике только при создании или первой настройке скаттерплота, т.к. контекст рендеринга WebGL создается только один раз. В качестве свойств экземпляра SPlot, они доступны только для чтения. Менять значения по умолчанию не рекомендуется и имеет смысл только в экспериментальных задачах.

| Параметр | По умолчанию | Описание |
| - | - |- |
| `webgl {}` |  | Параметры создания контекста рендеринга WebGL, полностью соответствующие типу [WebGLContextAttributes](https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2) спецификации  [WebGL 1.0](https://www.khronos.org/registry/webgl/specs/latest/1.0/). |
| `webgl.alpha` | `false`  | Наличие альфа-канала. |
| `webgl.depth` | `false`  | Наличие буфера глубины. |
| `webgl.stencil` | `false`  | Наличие буфера-трафарета. |
| `webgl.antialias` | `false`  | Режим сглаживания. |
| `webgl.desynchronized` | `true`  | Десонхронизация механизма растеризации канваса. |
| `webgl.premultipliedAlpha` | `false`  | Предварительное вычисление альфа-канала. |
| `webgl.preserveDrawingBuffer` | `false`  | Предотвращение автоматической очистки буферов. |
| `webgl.failIfMajorPerformanceCaveat` | `true`  | Попытка создания контекста с максимальной производительностью. |
| `webgl.powerPreference` | `"high-performance"`  | Тип энергоэффектиноости. Может принимать три значения: `default`, `high-performance`, `low-power`. |


# Cвойства

Большинство свойств описано в разделе [опций скаттерплота](#options). Дополнительно приведены только те свойства, которые могут быть полезны в прикладных задачах. Все свойства доступны только для чтения.

| Название | TS-тип | Описание |
| - | - | - |
| `isRunning` |  `boolean` | Признак активного (в момент проверки) процесса рендера. |
| `shapesCount` |  `number` | Количество возможных форм объектов, с которыми может работать скаттерплоот. Индексы-идентификаторы форм находятся в диапазоне: от 0 до (shapesCount - 1)|
| `canvas` |  `HTMLCanvasElement` | Объект-канвас, к которому привязан скаттерплот.|
| `lastRequestedOptions` |  `SPlotOptions` | Опции, которые были переданы скаттерплоту во время его последней настройки. |
| `stats.objTotalCount` |  `number` | Количество объектов на скаттерплоте. |
| `stats.memUsage` |  `number` | Объем видеопамяти занятый скаттерплотом. |
| `webgl.gpu.hardware` |  `string` | Название используемой клиентом видеокарты. |
| `webgl.gpu.software` |  `string` | Название используемого клиентом графического ПО. |


# Методы

```js
// Псевдокод создания скаттерплота.

let splotA = new SPlot(canvasId: string, options?: SPlotOptions)
```

Привязка к канвасу задается по его идентификатору `canvasId`. На момент создания скаттерплота указанный канвас должен существовать в документе. Одновременно с созданием скаттерплот можно настроить параметром `options` и запустить рендер. Количество скаттерплотов в документе не ограничено. Однако к одному канвасу может быть привязан только один скаттерплот.

| Название | Описание |
| - | - |
| `setup(options?: SPlotOptions)` | Настраивает скаттерплот. Во время настройки рендер не должен быть запущен. |
| `run()` | Запускает рендер. |
| `stop()` | Останавливает рендер. |
| `clear()` | Очищает канвас. |


<a name="objectdata"></a>
# Данные об объектах графика

Данные о каждом объекте графика передаются скаттерплоту либо через функцию итерирования `iterator`, либо готовым массивом данных об объектах `data`. В любом случае каждый объект должен описываться записью типа `SPlotObject`.

```ts
// Тип описывающий данные о каждом объекте графика.

interface SPlotObject {
  x: number,
  y: number,
  shape: number,
  size: number,
  color: number
}
```

| Поле | Описание |
| - | - |
| `x` | Положение центра объекта по оси X. Вещественное число в диапазоне от 0 до 1. |
| `y` | Положение центра объекта по оси Y. Вещественное число в диапазоне от 0 до 1. |
| `shape` | Индекс формы объекта (целое число). Базовые формы: `0` - квадрат, `1` - круг, `2` - крест, `3` - треугольник, `4` - шестеренка. |
| `size` | Размер объекта в пикселях (целое число). Оптимальный размер - число в пределах от `10` до `30`. |
| `color` | Индекс цвета объекта (целое число). Значением должен быть индекс в массиве цветов `colors`. |


# Быстрая демонстрация

Использование в виде модуля Node.js:

```js
import SPlot from 'splot'

// ...
// В HTML-шаблоне должен существовать канвас с id #my-canvas.

let splot = new SPlot('my-canvas', {
  demo: { isEnable: true },
  forceRun: true
})
```

Использование в виде обычного файла со скриптом:

```html
<html>
<head>
  <script src="splot.js"></script>
</head>
<body>
  <canvas id="my-canvas"></canvas>
  <script>
    let splot = new SPlot('my-canvas', {
      demo: { isEnable: true },
      forceRun: true
    })
  </script>
</body>
</html>
```


# В разработке
- [ ] Подготовка для использования в среде [datagrok](https://public.datagrok.ai/).
- [ ] Реализиация направляющих и измерительной шкалы.
- [ ] Кликабельность объектов.
- [ ] Обработка всех возможных ошибок выполнения.
- [ ] Перевод README и комментариев в коде на английский язык.


# Источники

- [Спецификация WebGL 1.0](https://www.khronos.org/registry/webgl/specs/latest/1.0/)

- [Спецификация OpenGL ES 2.0](https://www.khronos.org/registry/OpenGL/specs/es/2.0/es_full_spec_2.0.pdf)

- [Основы WebGL с примерами](https://webglfundamentals.org/)

- [Шейдерная песочница](https://www.shadertoy.com/new)
