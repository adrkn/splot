
/** ****************************************************************************
 *
 * Проверяет является ли переменная экземпляром какого-либоо класса.
 *
 * @param variable - Проверяемая переменная.
 * @returns Результат проверки.
 */
export function isObject(variable: any): boolean {
  return (Object.prototype.toString.call(variable) === '[object Object]')
}

/** ****************************************************************************
 *
 * Переопределяет значения полей объекта target на значения полей объекта source.
 *
 * @remarks
 * Переопределяются только те поля, которые существуеют в target. Если в source есть поля, которых нет в target, то они
 * игнорируются. Если какие-то поля сами являются являются объектами, то то они также рекурсивно копируются (при том же
 * условии, что в целевом объекте существуют поля объекта-источника).
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

/** ****************************************************************************
 *
 * Возвращает случайное целое число в диапазоне: [0...range-1].
 *
 * @param range - Верхний предел диапазона случайного выбора.
 * @returns Случайное число.
 */
export function randomInt(range: number): number {
  return Math.floor(Math.random() * range)
}

/** ****************************************************************************
 *
 * Конвертирует цвет из HEX-формата в GLSL-формат.
 *
 * @param hexColor - Цвет в HEX-формате ("#ffffff").
 * @returns Массив из трех чисел в диапазоне от 0 до 1.
 */
export function colorFromHexToGlRgb(hexColor: string): number[] {
  let k = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
  let [r, g, b] = [parseInt(k![1], 16) / 255, parseInt(k![2], 16) / 255, parseInt(k![3], 16) / 255]
  return [r, g, b]
}

/** ****************************************************************************
 *
 * Возвращает строковую запись текущего времени.
 *
 * @returns Строка времени в формате "hh:mm:ss".
 */
export function getCurrentTime(): string {

  let today = new Date()

  return [
    today.getHours().toString().padStart(2, '0'),
    today.getMinutes().toString().padStart(2, '0'),
    today.getSeconds().toString().padStart(2, '0')
  ].join(':')
}

export function shuffleArray(array: any[]): any[] {

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function shuffleMatrix(matrix: any[]): any[] {

  let array: any[] = []

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      array.push(matrix[i][j])
    }
  }

  shuffleArray(array)

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = array.pop()
    }
  }

  return matrix
}
