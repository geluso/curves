import Point from './point.js'
import Line from './Line.js'
import State from './State.js'

import LineDrawer from './drawers/line-drawer.js'

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
  STATE.lines.forEach(line => {
    LineDrawer.draw(CTX, STATE, line)
  })
}

function getAllPoints() {
  let points = STATE.lines.reduce((accum, line) => {
    return accum.concat(line.points)
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

    for (let i = 1; i < STATE.lines.length; i++) {
      let line1 = STATE.lines[i - 1]
      let line2 = STATE.lines[i]
      Line.alignControlPoints(line1, line2)
    }

    let firstLine = this.state.lines[0]
    let lastLine = this.state.lines[this.state.lines.length - 1]
    if (lastLine.end === firstLine.start) {
      Line.alignControlPoints(lastLine, firstLine)
    }

    draw()
  }
}

function mouseup(xx, yy) {
  SELECTED = null
}

function jiggle() {
  getAllPoints().forEach(pp => {
    pp.xx += pp.dxx
    pp.yy += pp.dyy

    if (pp.xx < 0 || pp.yy < 0 || pp.xx > WIDTH || pp.yy > HEIGHT) {
      pp.chooseRandomDirection()
    }

    pp.xx = Math.max(pp.xx, 0)
    pp.xx = Math.min(pp.xx, WIDTH)

    pp.yy = Math.max(pp.yy, 0)
    pp.yy = Math.min(pp.yy, HEIGHT)
  })

  for (let i = 1; i < STATE.lines.length; i++) {
    let line1 = STATE.lines[i - 1]
    let line2 = STATE.lines[i]
    Line.alignControlPoints(line1, line2)
  }

  draw()
}

