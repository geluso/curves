import Point from './point.js'

const WIDTH = 600
const HEIGHT = 600

//         MID  
// START         END
let START = new Point(50, 50)
let MID = new Point(75, 25)
let END = new Point(100, 50)
let POINTS = [START, MID, END]

let CTX
let SELECTED = null

// setInterval(main, 100)
main()

document.addEventListener('mousedown', wrapCoordinates(mousedown))
document.addEventListener('mousemove', wrapCoordinates(mousemove))
document.addEventListener('mouseup', wrapCoordinates(mouseup))

function main() {
  let canvas = document.getElementById('screen')  
  canvas.width = WIDTH
  canvas.height = HEIGHT
  
  CTX = canvas.getContext('2d')

  draw()
}

function draw() {
  CTX.clearRect(0, 0, WIDTH, HEIGHT)
  POINTS.forEach(drawPoint)
  lerp(START, MID, END)
}

function drawPoint(pp) {
  CTX.fillStyle = 'red'
  CTX.fillRect(pp.xx - 3, pp.yy - 3, 6, 6)
}

function lerp(p1, p2, p3) {
  CTX.fillStyle = randomRGB()

  // take a step pixel by pixel
  let resolution = Math.max(WIDTH, HEIGHT);
  for (let i = 0; i < resolution; i++) {
    let percent = i / resolution

    let mid1 = Point.lerp(p1, p2, percent)
    let mid2 = Point.lerp(p2, p3, percent)
    let mid3 = Point.lerp(mid1, mid2, percent)
    CTX.fillRect(mid3.xx, mid3.yy, 1, 1)
  }
}

function select(xx, yy) {
  let minDistance
  let closest
  POINTS.forEach(pp => {
    let distance = Point.distanceP(pp, xx, yy)
    console.log(pp, distance)
    if (!closest || distance < minDistance) {
      closest = pp
      minDistance = distance
    }
  })

  console.log(closest)
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

function randomRGB() {
  let red = Math.random() * 256
  let green = Math.random() * 256
  let blue = Math.random() * 256
  return `rgb(${red}, ${green}, ${blue})`
}
