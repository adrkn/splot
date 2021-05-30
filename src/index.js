import SPlot from '@/splot'
import '@/style'

/** ************************************************************************* */

let n = 10_000_000
let colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1']
let colors2 = ['#000000', '#ff0000', '#00ff00', '#0000ff']

/** Синтетическая итерирующая функция. */
let i = 0
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: Math.random(),
      y: Math.random(),
      shape: randomInt(5),
      size: 30,
      color: randomInt(colors.length)
    }
  } else {
    i = 0
    return null  // Возвращаем null, когда объекты "закончились".
  }
}

function randomInt(range) {
  return Math.floor(Math.random() * range)
}

const size = 30

const data = [
  { x: 0, y: 0, shape: 0, size: size, color: 0 },
  { x: 0, y: 0.5, shape: 0, size: size, color: 1 },
  { x: 0.5, y: 0.5, shape: 0, size: size, color: 2 },
  { x: 0.5, y: 0, shape: 0, size: size, color: 3 },
]

/** ************************************************************************* */

let scatterPlot = new SPlot('canvas1')

scatterPlot.setup({
  iterator: readNextObject,
  //data: data,
  colors: colors,
  debug: {
    isEnable: true,
  },
  demo: {
    isEnable: false
  },
  webgl: {
    failIfMajorPerformanceCaveat: true
  }
})

scatterPlot.run()
