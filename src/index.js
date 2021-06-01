import SPlot from '@/splot'
import '@/style'

/** ************************************************************************* */

const urlParams = new URLSearchParams(window.location.search)
const userN = urlParams.get('n')

let n = (userN)? userN : 1_000_000

let colors = ['#D81C01', '#E9967A', '#BA55D3', '#FFD700', '#FFE4B5', '#FF8C00', '#228B22', '#90EE90', '#4169E1', '#00BFFF', '#8B4513', '#00CED1']

/** Синтетическая итерирующая функция. */
let i = 0
function readNextObject() {
  if (i < n) {
    i++
    return {
      x: Math.random(),
      y: Math.random(),
      shape: randomInt(5),
      size: 10 + randomInt(21),
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

/** ************************************************************************* */

let scatterPlot = new SPlot('canvas1')

scatterPlot.setup({
  iterator: readNextObject,
  colors: colors,
  debug: {
    isEnable: true,
  },
  demo: {
    isEnable: false
  }
})

scatterPlot.run()

/** ************************************************************************* */

document.getElementById('obj-count').innerHTML = scatterPlot.stats.objTotalCount.toLocaleString()
