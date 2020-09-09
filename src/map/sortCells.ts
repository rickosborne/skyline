import {ScreenMapCell} from "./MapTypes";
import {sortCoordinates} from "./sortCoordinates";

export function sortCells(a: ScreenMapCell, b: ScreenMapCell): number {
  return sortCoordinates(a.coordinate, b.coordinate);
}
