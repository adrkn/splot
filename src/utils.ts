
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
 * Переопределяет значения полей объекта target на значения полей объекта source. Переопределяются только те поля,
 * которые существуеют в target. Если в source есть поля, которых нет в target, то они игнорируются. Если какие-то поля
 * сами являются являются объектами, то то они также рекурсивно копируются (при том же условии, что в целеом объекте
 * существуют поля объекта-источника).
 *
 * @param target - Целевой (изменяемый) объект.
 * @param source - Объект с данными, которые нужно установить у целевого объекта.
 */
export function copyMatchingKeyValues(target: any, source: any): void {
  Object.keys(source).forEach(key => {
    if (key in target) {
      if (isObject(source[key])) {
        if (isObject(target[key])) {
          copyMatchingKeyValues(target[key], source[key])
        }
      } else {
        if (!isObject(target[key]) && (typeof target[key] !== 'function')) {
          target[key] = source[key]
        }
      }
    }
  })
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
