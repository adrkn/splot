/** ****************************************************************************
 *
 * Тип - функция итерирования исходных объектов. Каждый вызов функции должен возвращать информацию об очередном объекте
 * в заданном формате. Когда исходные объекты закончатся функция должна вернуть null.
 */
type SPlotIterator = ( () => SPlotObject | null ) | undefined

/** ****************************************************************************
 *
 * Тип - массив данных, занимающих в памяти непрерывный объем.
 */
type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array

/** ****************************************************************************
 *
 * Тип - настройки приложения.
 *
 * @param iterator - Функция итерирования исходных объектов.
 * @param demo - Параметры демо-режима.
 * @param debug - Параметры режима отладки.
 * @param webgl - Параметры контекста рендеринга WebGL.
 * @param forceRun - Признак необходимости ускоренного запуска рендера - сразу после задания настроек.
 * @param globalLimit - Ограничение максимального количества объектов на графике.
 * @param groupLimit - Ограничение максимального количества объектов в группе.
 * @param colors - Цветовая палитра полигонов.
 * @param grid - Параметры координатной плоскости.
 * @param camera - Параметры области просмотра.
 */
interface SPlotOptions {
  iterator?: SPlotIterator,
  demo?: SPlotDemo,
  debug?: SPlotDebug,
  webgl?: SPlotWebGl,
  forceRun?: boolean,
  globalLimit?: number,
  groupLimit?: number,
  colors?: string[],
  grid?: SPlotGrid,
  camera?: SPlotCamera
}

/** ****************************************************************************
 *
 * Тип для параметров режима отображения демонстрационных данных.
 *
 * @param isEnable - Признак включения демо-режима.
 * @param amount - Количество имитируемых исходных объектов.
 * @param shapeQuota - Частота появления различных форм полигонов. Пример: массив [3, 2, 5] означает, что частота 1-й
 *     первой формы = 3/(3+2+5) = 3/10, частота 2-й формы = 2/(3+2+5) = 2/10, частота 3-й формы = 5/(3+2+5) = 5/10.
 */
interface SPlotDemo {
  isEnable?: boolean,
  amount?: number,
  shapeQuota?: number[],
  sizeMin?: number,
  sizeMax?: number,
  colors?: string[]
}

/** ****************************************************************************
 *
 * Тип - отображаемый на графике объект.
 *
 * @param x - Координата на оси абсцисс.
 * @param y - Координата на оси ординат.
 * @param shape - Форма объекта (индекс в массиве форм).
 * @param color - Цвет объекта (индекс в массиве цветов).
 */
interface SPlotObject {
  x: number,
  y: number,
  shape: number,
  size: number,
  color: number
}

/** ****************************************************************************
 *
 * Тип - Координатная плоскость.
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
