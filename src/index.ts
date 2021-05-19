import SPlot from './splot'
import '@/style'

function randomInt(range: number) {
  return Math.floor(Math.random() * range)
}

let i = 0
let n = 1_000_000  // Имитируемое число объектов.
let colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1']
let plotWidth = 32_000
let plotHeight = 16_000

// Пример итерирующей функции. Итерации имитируются случайными выдачами. Почти также работает режим демо-данных.
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: randomInt(plotWidth),
      y: randomInt(plotHeight),
      shape: randomInt(2),
      size: 10 + randomInt(21),
      color: randomInt(colors.length),  // Индекс цвета в массиве цветов
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
  iterator: readNextObject,
  colors: colors,
  grid: {
    width: plotWidth,
    height: plotHeight,
  },
  debug: {
    isEnable: true,
  },
  demo: {
    isEnable: false,
  },
  useVertexIndices: false
})

scatterPlot.run()

//scatterPlot.stop()

//setTimeout(() => scatterPlot.stop(), 3000)
