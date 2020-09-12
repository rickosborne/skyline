import {Edge} from "./Edge";

export function printEdge(edge: Edge): string {
  return `(${edge.x1},${edge.y1})->(${edge.x2},${edge.y2})${edge.s == null ? "" : `/${edge.s}`}`;
}
