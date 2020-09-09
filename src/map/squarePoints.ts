import {ScreenMapCell} from "./MapTypes";
import {INSET_DEFAULT} from "./mapConstants";
import {Point2D} from "./Point2D";
import {squareCoordinates} from "./squareCoordinates";

export function squarePoints(cells: ScreenMapCell[], inset: number = INSET_DEFAULT): Point2D[] {
  return squareCoordinates(cells, inset).map(c => [c.x, c.y]);
}
