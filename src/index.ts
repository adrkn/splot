import SPlot from './splot'
import '@/style'

function randomInt(range: number) {
  return Math.floor(Math.random() * range)
}

let i = 0
let n = 1_000_000  // Имитируемое число объектов.
let palette = ['#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00', '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080']
let plotWidth = 32_000
let plotHeight = 16_000

// Пример итерирующей функции. Итерации имитируются случайными выдачами. Почти также работает режим демо-данных.
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: randomInt(plotWidth),
      y: randomInt(plotHeight),
      shape: 0,
      size: 5 + randomInt(16),
      color: randomInt(palette.length),  // Индекс цвета в массиве цветов
    }
  }
  else
    return null  // Возвращаем null, когда объекты "закончились"
}

/** ======================================================================== **/

let scatterPlot = new SPlot('canvas1')

// Настройка экземпляра на режим вывода отладочной информации в консоль браузера.
// Другие примеры работы описаны в файле splot.js со строки 214.
scatterPlot.setup({
  iterationCallback: readNextObject,
  polygonPalette: palette,
  gridSize: {
    width: plotWidth,
    height: plotHeight,
  },
  debugMode: {
    isEnable: true,
  },
  demoMode: {
    isEnable: false,
  },
})

scatterPlot.run()
//scatterPlot.stop()

//setTimeout(() => scatterPlot.stop(), 3000)
