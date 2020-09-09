import {BlockLayoutBounds} from "../template/ScreenText";
import {Coordinate, isShape, ScreenMapShape} from "./MapTypes";

export function boundingBox(coordinates: ScreenMapShape | Coordinate[]): BlockLayoutBounds {
  const coords = isShape(coordinates) ? coordinates.cells.map(c => c.coordinate) : coordinates;
  return coords.reduce((b, c) => {
    if (b.left == null || b.left > c.x) {
      b.left = c.x;
    }
    if (b.right == null || b.right < c.x) {
      b.right = c.x;
    }
    if (b.top == null || b.top > c.y) {
      b.top = c.y;
    }
    if (b.bottom == null || b.bottom < c.y) {
      b.bottom = c.y;
    }
    return b;
  }, {} as Partial<BlockLayoutBounds>) as BlockLayoutBounds;
}
