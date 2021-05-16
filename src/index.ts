import SPlot from './splot'
import '@/style'

function randomInt(range: number) {
  return Math.floor(Math.random() * range)
}

let i = 0
let n = 5  // Имитируемое число объектов.
let palette = ['#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00', '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080']
let plotWidth = 800
let plotHeight = 400

// Пример итерирующей функции. Итерации имитируются случайными выдачами. Почти также работает режим демо-данных.
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: randomInt(plotWidth),
      y: randomInt(plotHeight),
      shape: randomInt(3),               // 0 - треугольник, 1 - квадрат, 2 - круг
      color: randomInt(palette.length),  // Индекс цвета в массиве цветов
    }
  }
  else
    return null  // Возвращаем null, когда объекты "закончились"
}


let objects = [
  { x: 350, y: 150, shape: 1, color: 1 },
  { x: 450, y: 150, shape: 1, color: 2 },
  { x: 350, y: 250, shape: 1, color: 3 },
  { x: 450, y: 250, shape: 1, color: 4 },
]

let j = -1

function readNextObject2() {
  if (j < objects.length) {
    j++
    return objects[j]
  }
  else
    return null  // Возвращаем null, когда объекты "закончились"
}

/** ======================================================================== **/

let scatterPlot = new SPlot('canvas1')

// Настройка экземпляра на режим вывода отладочной информации в консоль браузера.
// Другие примеры работы описаны в файле splot.js со строки 214.
scatterPlot.setup({
  iterationCallback: readNextObject2,
  polygonPalette: palette,
  polygonSize: 50,
  gridSize: {
    width: plotWidth,
    height: plotHeight,
  },
  camera: {
    x: 0,
    y: 0
  },
  debugMode: {
    isEnable: true,
  },
  demoMode: {
    isEnable: false,
  },
})

scatterPlot.run()
