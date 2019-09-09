import Point from './point.js'
import Line from './Line.js'
import State from './State.js'

import Util from './util.js'

import {
  WIDTH, HEIGHT, NUM_INITIAL_LINES,
  LINE_THICKNESS, POINT_SIZE, HALF_POINT_SIZE,
  JIGGLE_FACTOR
} from './config.js'

let CTX
let SELECTED = null

let STATE = new State(draw)

main()

window.requestAnimationFrame(jiggleLoop)
function jiggleLoop() {
  if (STATE.isJiggling) {
    jiggle()
  }
  window.requestAnimationFrame(jiggleLoop)
}

document.addEventListener('mousedown', wrapCoordinates(mousedown))
document.addEventListener('mousemove', wrapCoordinates(mousemove))
document.addEventListener('mouseup', wrapCoordinates(mouseup))

function main() {
  let canvas = document.getElementById('screen')  
  canvas.width = WIDTH
  canvas.height = HEIGHT
  
  CTX = canvas.getContext('2d')
  STATE.controls.reset()
}

function draw() {
  CTX.clearRect(0, 0, WIDTH, HEIGHT)
  STATE.lines.forEach(drawLine)
}

function drawLine(line) {
  drawPoint(line.start)
  drawPoint(line.end)

  if (STATE.isDrawingMidpoints) {
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
  if (STATE.isRandomColors) {
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
  let points = STATE.lines.reduce((accum, line) => {
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

