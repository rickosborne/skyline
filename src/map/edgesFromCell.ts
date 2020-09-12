import {Edge} from "./Edge";
import {ScreenMapCell} from "./MapTypes";

export function edgesFromCell(cell: ScreenMapCell): Edge[] {
  const x = cell.coordinate.x;
  const y = cell.coordinate.y;
  const s = `${x},${y}`;
  const nw = cell.coordinate;
  const ne = {x: x + 1, y};
  const se = {x: x + 1, y: y + 1};
  const sw = {x, y: y + 1};
  return [
    {x1: nw.x, y1: nw.y, x2: ne.x, y2: ne.y, s},
    {x1: ne.x, y1: ne.y, x2: se.x, y2: se.y, s},
    {x1: se.x, y1: se.y, x2: sw.x, y2: sw.y, s},
    {x1: sw.x, y1: sw.y, x2: nw.x, y2: nw.y, s},
  ];
}
