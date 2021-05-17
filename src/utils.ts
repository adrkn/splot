
/**
 * Проверяет является ли переменная экземпляром какого-либоо класса.
 *
 * @param val - Проверяемая переменная.
 * @returns Результат проверки.
 */
export function isObject(obj: any): boolean {
  return (Object.prototype.toString.call(obj) === '[object Object]')
}

/**
 * Возвращает случайное целое число в диапазоне: [0...range-1].
 *
 * @param range - Верхний предел диапазона случайного выбора.
 * @returns Случайное число.
 */
export function randomInt(range: number): number {
  return Math.floor(Math.random() * range)
}

/**
 * Преобразует объект в строку JSON. Имеет отличие от стандартной функции JSON.stringify - поля объекта, имеющие
 * значения функций не пропускаются, а преобразуются в название функции.
 *
 * @param obj - Целевой объект.
 * @returns Строка JSON, отображающая объект.
 */
export function jsonStringify(obj: any): string {
  return JSON.stringify(
    obj,
    function (key, value) {
      return (typeof value === 'function') ? value.name : value
    },
    ' '
  )
}

/**
 * Случайным образом возвращает один из индексов числового одномерного массива. Несмотря на случайность каждого
 * конкретного вызова функции, индексы возвращаются с предопределенной частотой. Частота "выпаданий" индексов задается
 * соответствующими значениями элементов.
 *
 * @remarks
 * Пример: На массиве [3, 2, 5] функция будет возвращать индекс 0 с частотой = 3/(3+2+5) = 3/10, индекс 1 с частотой =
 * 2/(3+2+5) = 2/10, индекс 2 с частотой = 5/(3+2+5) = 5/10.
 *
 * @param arr - Числовой одномерный массив, индексы которого будут возвращаться с предопределенной частотой.
 * @returns Случайный индекс из массива arr.
 */
export function randomQuotaIndex(arr: number[]): number {

  let a: number[] = []
  a[0] = arr[0]

  for (let i = 1; i < arr.length; i++) {
    a[i] = a[i - 1] + arr[i]
  }

  const lastIndex: number = a.length - 1

  let r: number = Math.floor((Math.random() * a[lastIndex])) + 1
  let l: number = 0
  let h: number = lastIndex

  while (l < h) {
    const m: number = l + ((h - l) >> 1);
    (r > a[m]) ? (l = m + 1) : (h = m)
  }

  return (a[l] >= r) ? l : -1
}


/**
 * Конвертирует цвет из HEX-представления в представление цвета для GLSL-кода (RGB с диапазонами значений от 0 до 1).
 *
 * @param hexColor - Цвет в HEX-формате.
 * @returns Массив из трех чисел в диапазоне от 0 до 1.
 */
export function colorFromHexToGlRgb(hexColor: string): number[] {

  let k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
  let [r, g, b] = [parseInt(k![1], 16) / 255, parseInt(k![2], 16) / 255, parseInt(k![3], 16) / 255]

  return [r, g, b]
}

/**
 * Вычисляет текущее время.
 *
 * @returns Строковая форматированная запись текущего времени. Формат: hh:mm:ss
 */
export function getCurrentTime(): string {

  let today = new Date();

  let time =
    ((today.getHours() < 10 ? '0' : '') + today.getHours()) + ":" +
    ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes()) + ":" +
    ((today.getSeconds() < 10 ? '0' : '') + today.getSeconds())

  return time
}
