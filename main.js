import Point from './point.js'
import Line from './Line.js'

import Util from './util.js'
import {
  WIDTH, HEIGHT, NUM_INITIAL_LINES,
  LINE_THICKNESS, POINT_SIZE, HALF_POINT_SIZE,
  JIGGLE_FACTOR
} from './config.js'


let LINES = []
for (let i = 0; i < NUM_INITIAL_LINES; i++) {
  LINES.push(Line.randomLine())
}

let IS_RANDOM_COLORS = false
let IS_DRAWING_MIDPOINTS = false

let CTX
let SELECTED = null

main()

window.requestAnimationFrame(jiggleLoop)
function jiggleLoop() {
  jiggle()
  window.requestAnimationFrame(jiggleLoop)
}

document.addEventListener('mousedown', wrapCoordinates(mousedown))
document.addEventListener('mousemove', wrapCoordinates(mousemove))
document.addEventListener('mouseup', wrapCoordinates(mouseup))

let toggleRandomColorsButton = document.getElementById('toggle-random-colors')
let toggleRandomColorsValue = document.getElementById('toggle-random-colors-value')
toggleRandomColorsButton.addEventListener('click', toggleRandomColors)

let toggleMidpointsButton = document.getElementById('toggle-drawing-midpoints')
let toggleMidpointsValue = document.getElementById('toggle-drawing-midpoints-value')
toggleMidpointsButton.addEventListener('click', toggleMidpoints)

let newLineButton = document.getElementById('new-line')
newLineButton.addEventListener('click', newLine)

function main() {
  let canvas = document.getElementById('screen')  
  canvas.width = WIDTH
  canvas.height = HEIGHT
  
  CTX = canvas.getContext('2d')

  draw()
}

function draw() {
  CTX.clearRect(0, 0, WIDTH, HEIGHT)
  LINES.forEach(drawLine)
}

function drawLine(line) {
  drawPoint(line.start)
  drawPoint(line.end)

  if (IS_DRAWING_MIDPOINTS) {
    drawPoint(line.mid)
  }

  lerp(line)
}

function drawPoint(pp) {
  CTX.fillStyle = pp.color
  let xx = pp.xx - HALF_POINT_SIZE
  let yy = pp.yy - HALF_POINT_SIZE
  CTX.fillRect(xx, yy, POINT_SIZE, POINT_SIZE)
}

function lerp(line) {
  if (IS_RANDOM_COLORS) {
    line.color = Util.randomRGB()
  }
  CTX.fillStyle = line.color

  // take a step pixel by pixel
  let resolution = Math.max(WIDTH, HEIGHT);
  for (let i = 0; i < resolution; i++) {
    let percent = i / resolution

    let mid1 = Point.lerp(line.start, line.mid, percent)
    let mid2 = Point.lerp(line.mid, line.end, percent)
    let mid3 = Point.lerp(mid1, mid2, percent)
    CTX.fillRect(mid3.xx, mid3.yy, LINE_THICKNESS, LINE_THICKNESS)
  }
}

function getAllPoints() {
  let points = LINES.reduce((accum, line) => {
    return accum.concat(line.start, line.mid, line.end)
  }, [])
  return points
}

function select(xx, yy) {
  let minDistance
  let closest

  getAllPoints().forEach(pp => {
    let distance = Point.distanceP(pp, xx, yy)
    if (!closest || distance < minDistance) {
      closest = pp
      minDistance = distance
    }
  })

  return closest
}

function wrapCoordinates(func) {
  return (ev) => {
    let xx = ev.offsetX
    let yy = ev.offsetY
    func(xx, yy)
  }
    
}

function mousedown(xx, yy) {
  SELECTED = select(xx, yy)
}

function mousemove(xx, yy) {
  if (SELECTED) {
    SELECTED.xx = xx
    SELECTED.yy = yy
    draw()
  }
}

function mouseup(xx, yy) {
  SELECTED = null
}

function toggleRandomColors() {
  IS_RANDOM_COLORS = !IS_RANDOM_COLORS
  toggleRandomColorsValue.textContent = IS_RANDOM_COLORS
  return true
}

function toggleMidpoints() {
  IS_DRAWING_MIDPOINTS = !IS_DRAWING_MIDPOINTS
  toggleMidpointsValue.textContent = IS_DRAWING_MIDPOINTS
  draw()
  return true
}


function newLine() {
  LINES.push(Line.randomLine())
  draw()
}

function jiggle() {
  getAllPoints().forEach(pp => {
    if (Math.random() < .5) {
      pp.xx += JIGGLE_FACTOR
    } else {
      pp.xx -= JIGGLE_FACTOR
    }
    pp.xx = Math.max(pp.xx, 0)
    pp.xx = Math.min(pp.xx, WIDTH)

    if (Math.random() < .5) {
      pp.yy += JIGGLE_FACTOR
    } else {
      pp.yy -= JIGGLE_FACTOR
    }
    pp.yy = Math.max(pp.yy, 0)
    pp.yy = Math.min(pp.yy, HEIGHT)
  })

  draw()
}
