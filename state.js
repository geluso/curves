import Controls from './controls.js'
import {
  IS_JIGGLING_INITIAL,
  IS_DRAWING_MIDPOINTS_INITIAL,
  IS_RANDOM_COLORS_INITIAL
} from './config.js'

export default class State {
  constructor(draw) {
    this.draw = draw

    this.lines = []
    this.lastLine = null
    this.isJiggling = IS_JIGGLING_INITIAL
    this.isRandomColors = IS_RANDOM_COLORS_INITIAL
    this.isDrawingMidpoints = IS_DRAWING_MIDPOINTS_INITIAL

    this.controls = new Controls(this)
  }
}
