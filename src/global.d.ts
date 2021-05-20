/**
 * Тип функции итерирования массива исходных объектов. Каждый вызов такой функции должен возвращать информацию об
 * очередном полигоне, который необходимо отобразить (его координаты, форму и цвет). Когда исходные объекты закончатся
 * функция должна вернуть null.
 */
type SPlotIterator = (() => SPlotPolygon | null) | undefined

/**
 * Тип массива данных, занимающих в памяти непрерывный объем.
 */
type TypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array

/**
 * Тип для настроек приложения.
 *
 * @param iterator - Функция итерирования исходных объектов.
 * @param colors - Цветовая палитра полигонов.
 * @param grid - Размер координатной плоскости в пикселях.
 * @param polygonSize - Размер полигона на графике в пикселях (сторона для квадрата, диаметр для круга и т.п.)
 * @param debug - Параметры режима отладки приложения.
 * @param demo - Параметры режима использования демонстрационных данных.
 * @param forceRun - Признак того, что рендеринг необходимо начать сразу после задания настроек экземпляра (по умолчанию
 *     рендеринг запускается только после вызова метода start).
 * @param maxAmountOfPolygons - Искусственное ограничение количества отображаемых полигонов. При достижении этого числа
 *     итерирование исходных объектов прерывается, даже если обработаны не все объекты.
 * @param bgColor - Фоновый цвет канваса.
 * @param rulesColor - Цвет направляющих.
 * @param camera - Положение координатной плоскости в области просмотра.
 * @param webgl - Инициализирующие настройки контекста рендеринга WebGL.
 */
interface SPlotOptions {
  iterator?: SPlotIterator,
  colors?: string[],
  grid?: SPlotGrid,
  polygonSize?: number,
  debug?: SPlotDebug,
  demo?: SPlotDemoMode,
  forceRun?: boolean,
  maxAmountOfPolygons?: number,
  camera?: SPlotCamera,
  useVertexIndices?: boolean,
  webgl?: WebGLContextAttributes
}

/**
 * Тип для информации о полигоне. Содержит данные, необходимые для добавления полигона в группу полигонов. Полигон - это
 * сплошная фигура на координатной плоскости, однозначно представляющая один исходный объект.
 *
 * @param x - Координата центра полигона на оси абсцисс. Может быть как целым, так и вещественным числом.
 * @param y - Координата центра полигона на оси ординат. Может быть как целым, так и вещественным числом.
 * @param shape - Форма полигона. Форма - это индекс в массиве форм {@link shapes}. Основные формы: 0 - треугольник, 1 -
 *     квадрат, 2 - круг.
 * @param color - Цвет полигона. Цвет - это индекс в диапазоне от 0 до 255, представляющий собой индекс цвета в
 *     предопределенном массиве цветов {@link colors}.
 */
interface SPlotPolygon {
  x: number,
  y: number,
  shape: number,
  size: number,
  color: number
}

/**
 * Тип для размера координатной плоскости.
 *
 * @param width - Ширина координатной плоскости в пикселях.
 * @param height - Высота координатноой плоскости в пикселях.
 */
interface SPlotGrid {
  width?: number,
  height?: number,
  bgColor?: string,
  rulesColor?: string
}

/**
 * Тип для параметров режима отображения демонстрационных данных.
 *
 * @param isEnable - Признак включения демо-режима. В этом режиме приложение вместо внешней функции итерирования
 *     исходных объектов использует внутренний метод, имитирующий итерирование.
 * @param amount - Количество имитируемых исходных объектов.
 * @param shapeQuota - Частота появления в итерировании различных форм полигонов - треугольников[0], квадратов[1],
 *     кругов[2] и т.д. Пример: массив [3, 2, 5] означает, что частота появления треугольников = 3/(3+2+5) = 3/10,
 *     частота появления квадратов = 2/(3+2+5) = 2/10, частота появления кругов = 5/(3+2+5) = 5/10.
 */
interface SPlotDemoMode {
  isEnable?: boolean,
  amount?: number,
  shapeQuota?: number[],
}

/**
 * Тип для положения координатной плоскости в области просмотра.
 *
 * @param x - Координата графика на оси абсцисс.
 * @param y - Координата графика на оси ординат.
 * @param zoom - Степень "приближения" наблюдателя к графику (масштаб коодринатной плоскости в области просмотра).
 */
interface SPlotCamera {
  x?: number,
  y?: number,
  zoom?: number
}

/**
 * Тип для трансформации. Содержит всю техническую информацию, необходимую для рассчета текущего положения координатной
 * плоскости в области просмотра во время событий перемещения и зумирования канваса.
 *
 * @param viewProjectionMat - Основная матрица трансформации 3x3 в виде одномерного массива из 9 элементов.
 * @param startInvViewProjMat - Вспомогательная матрица трансформации.
 * @param startCameraX - Вспомогательная точка трансформации.
 * @param startCameraY - Вспомогательная точка трансформации.
 * @param startPosX - Вспомогательная точка трансформации.
 * @param startPosY - Вспомогательная точка трансформации.
 */
interface SPlotTransform {
  viewProjectionMat: number[],
  startInvViewProjMat: number[],
  startCamera: SPlotCamera,
  startPos: number[],
  startClipPos: number[],
  startMousePos: number[]
}

/**
 * Тип для информации о группе полигонов, которую можно отобразить на канвасе за один вызов функции {@link drawElements}.
 *
 * @param vertices - Массив вершин всех полигонов группы. Каждая вершина - это пара чисел (координаты вершины на
 *     плоскости). Координаты могут быть как целыми, так и вещественными числами.
 * @param colors - Массив цветов вершин полигонов группы. Каждое число задает цвет одной вершины в массиве вершин. Чтобы
 *     полигон был сплошного однородного цвета необходимо чтобы все вершины полигона имели одинаковый цвет. Цвет - это
 *     целое число в диапазоне от 0 до 255, представляющее собой индекс цвета в предопределенном массиве цветов.
 * @param amountOfVertices - Количество всех вершин в группе полигонов.
 */
interface SPlotPolygonGroup {
  vertices: number[],
  colors: number[],
  shapes: number[],
  sizes: number[],
  amountOfVertices: number,
}

/**
 * Тип для информации о вершинах полигона.
 *
 * @param vertices - Массив всех вершин полигона. Каждая вершина - это пара чисел (координаты вершины на
 *     плоскости). Координаты могут быть как целыми, так и вещественными числами.
 */
interface SPlotPolygonVertices {
  values: number[],
  shape: number,
  size: number
}
