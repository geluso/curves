import Controls from './controls.js'

export default class State {
  constructor(draw) {
    this.draw = draw

    this.lines = []
    this.lastLine = null
    this.isJiggling = false
    this.isRandomColors = false
    this.isDrawingMidpoints = false

    this.controls = new Controls(this)
  }
}
