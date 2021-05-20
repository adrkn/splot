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
 * @param demo - Параметры демо-режима. Класс `SPlotDemo` описан в модуле {@link splot-demo}.
 * @param debug - Параметры режима отладки. Класс `SPlotDebug` описан в модуле {@link splot-debug}.
 * @param webgl - Параметры контекста рендеринга WebGL. Класс `SPlotWebGl` описан в модуле {@link splot-webgl}.
 * @param forceRun - Признак необходимости ускоренного запуска рендера - сразу после задания настроек.
 * @param globalLimit - Ограничение максимального количества объектов на графике.
 * @param groupLimit - Ограничение максимального количества объектов в группе.
 * @param colors - Цветовая палитра объектов.
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
 * Тип - отображаемый на графике объект.
 *
 * @param x - Координата на плоскости по оси абсцисс.
 * @param y - Координата на плоскости по оси ординат.
 * @param shape - Форма объекта (0 - круг, 1 - квадрат).
 * @param size - Размер объекта в пикселях.
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
