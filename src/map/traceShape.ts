import {grahamScan2} from "@thi.ng/geom-hull";
import {Coordinate, isShape, ScreenMapCell, ScreenMapShape} from "./MapTypes";
import {INSET_DEFAULT} from "./mapConstants";
import {Point2D} from "./Point2D";
import {squarePoints} from "./squarePoints";

export function traceShape(shape: ScreenMapShape | ScreenMapCell[], inset: number = INSET_DEFAULT): Coordinate[] {
  const cells: ScreenMapCell[] = isShape(shape) ? shape.cells : shape;
  if (cells.length === 0) {
    return [];
  }
  const points = squarePoints(cells, inset);
  const bounds = grahamScan2(points)
  return bounds.map((point: Point2D) => ({x: point[0], y: point[1]}));
}
