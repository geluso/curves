import Point from '../point.js'
import PointDrawer from './point-drawer.js'

import { WIDTH, HEIGHT, LINE_THICKNESS } from '../config.js'

export default class LineDrawer {
  static draw(ctx, state, line) {
    PointDrawer.draw(ctx, line.start)
    PointDrawer.draw(ctx, line.end)

    if (state.isDrawingMidpoints) {
      PointDrawer.draw(ctx, line.mid)
    }

    LineDrawer.lerp(ctx, state, line)
  }

  static lerp(ctx, state, line) {
    if (state.isRandomColors) {
      line.color = Util.randomRGB()
    }
    ctx.fillStyle = line.color

    // take a step pixel by pixel
    let resolution = Math.max(WIDTH, HEIGHT);
    for (let i = 0; i < resolution; i++) {
      let percent = i / resolution

      let mid1 = Point.lerp(line.start, line.mid, percent)
      let mid2 = Point.lerp(line.mid, line.end, percent)
      let mid3 = Point.lerp(mid1, mid2, percent)
      ctx.fillRect(mid3.xx, mid3.yy, LINE_THICKNESS, LINE_THICKNESS)
    }
  }
}
