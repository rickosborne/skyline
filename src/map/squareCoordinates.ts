import {Coordinate, ScreenMapCell} from "./MapTypes";
import {INSET_DEFAULT} from "./mapConstants";

export function squareCoordinates(cells: ScreenMapCell[], inset: number = INSET_DEFAULT): Coordinate[] {
  return cells.flatMap(cell => {
    const x = cell.coordinate.x;
    const y = cell.coordinate.y;
    return [
      {x: x + inset, y: y + inset},
      {x: x + 1 - inset, y: y + inset},
      {x: x + inset, y: y + 1 - inset},
      {x: x + 1 - inset, y: y + 1 - inset},
    ];
  })
}
