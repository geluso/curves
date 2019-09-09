import Point from './point.js'
import Line from './Line.js'

import Util from './util.js'
import {
  WIDTH, HEIGHT, NUM_INITIAL_LINES,
  LINE_THICKNESS, POINT_SIZE, HALF_POINT_SIZE,
  JIGGLE_FACTOR
} from './config.js'

let CTX
let SELECTED = null

let LINES = []
let LAST_LINE = null
let IS_RANDOM_COLORS = false
let IS_DRAWING_MIDPOINTS = false

main()

window.requestAnimationFrame(jiggleLoop)
function jiggleLoop() {
  jiggle()
  window.requestAnimationFrame(jiggleLoop)
}

document.addEventListener('mousedown', wrapCoordinates(mousedown))
document.addEventListener('mousemove', wrapCoordinates(mousemove))
document.addEventListener('mouseup', wrapCoordinates(mouseup))

let resetButton = document.getElementById('reset')
resetButton.addEventListener('click', reset)

let newLineButton = document.getElementById('new-line')
newLineButton.addEventListener('click', newLine)

let clearButton = document.getElementById('clear')
clearButton.addEventListener('click', clearAll)

let oneColorButton = document.getElementById('all-one-color')
oneColorButton.addEventListener('click', allOneColor)

let toggleRandomColorsButton = document.getElementById('toggle-random-colors')
let toggleRandomColorsValue = document.getElementById('toggle-random-colors-value')
toggleRandomColorsButton.addEventListener('click', toggleRandomColors)

let toggleMidpointsButton = document.getElementById('toggle-drawing-midpoints')
let toggleMidpointsValue = document.getElementById('toggle-drawing-midpoints-value')
toggleMidpointsButton.addEventListener('click', toggleMidpoints)

function main() {
  let canvas = document.getElementById('screen')  
  canvas.width = WIDTH
  canvas.height = HEIGHT
  
  CTX = canvas.getContext('2d')
  reset()
}

function reset() {
  LINES = []
  for (let i = 0; i < NUM_INITIAL_LINES; i++) {
    newLine()
  }

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

function allOneColor() {
  let color = Util.randomRGB()
  LINES.forEach(line => {
    line.color = color
  })
  draw()
  return true
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
  let line = Line.randomLine()
  if (LAST_LINE) {
    line.start = LAST_LINE.end
    line.points[0] = LAST_LINE.end
  }
  LAST_LINE = line

  LINES.push(line)
  draw()

  return true
}

function jiggle() {
  getAllPoints().forEach(pp => {
    let degree = Math.random() * 360
    let xx = JIGGLE_FACTOR * Math.cos(degree)
    let yy = JIGGLE_FACTOR * Math.sin(degree)

    pp.xx += xx
    pp.yy += yy

    pp.xx = Math.max(pp.xx, 0)
    pp.xx = Math.min(pp.xx, WIDTH)

    pp.yy = Math.max(pp.yy, 0)
    pp.yy = Math.min(pp.yy, HEIGHT)
  })

  draw()
}

function clearAll() {
  LINES = []
  draw()
}
