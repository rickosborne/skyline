import {COMPASS_FROM_DX_DY, CompassPoint} from "../template/TileSet";
import {Edge} from "./Edge";

export function headingForEdge(edge: Edge): CompassPoint {
  const dx = edge.x2 - edge.x1;
  const dy = edge.y2 - edge.y1;
  return COMPASS_FROM_DX_DY[dx][dy];
}
