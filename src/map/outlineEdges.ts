import {COMPASS_NEXT_LH} from "../template/TileSet";
import {Edge} from "./Edge";
import {groupBy} from "./groupBy";
import {headingForEdge} from "./headingForEdge";
import {Coordinate} from "./MapTypes";
import {printEdge} from "./printEdge";

export function outlineEdges(edges: Edge[]): Coordinate[][] {
  const edgeKey = (edge: Edge) => `${edge.x1},${edge.y1}`;
  const edgesByStart = groupBy(edges, edgeKey);
  const e: Edge[] = ([] as Edge[]).concat(...edges);
  let r: Coordinate[] = [];
  const rr: Coordinate[][] = [r];
  let edge = e.shift();
  if (edge != null) {
    r.push({x: edge.x1, y: edge.y1});
  }
  while (edge != null) {
    const x = edge.x2;
    const y = edge.y2;
    r.push({x, y});
    const startKey = `${x},${y}`;
    const sameStart = edgesByStart.get(startKey);
    if (sameStart == null || sameStart.length === 0) {
      if (e.length > 0) {
        edge = e.shift() as Edge;
        r = [{x: edge.x1, y: edge.y1}];
        rr.push(r);
        const thisStart = edgesByStart.get(edgeKey(edge)) as Edge[];
        thisStart.splice(thisStart.findIndex(t => t === edge), 1);
      } else {
        break;
      }
    } else if (sameStart.length === 1) {
      edge = sameStart.shift();
      const n = e.findIndex(t => t === edge);
      e.splice(n, 1);
    } else {
      let heading = headingForEdge(edge);
      edge = undefined;
      for (let i = 0; i < 4 && edge == null; i++) {
        let nextHeading = COMPASS_NEXT_LH[heading];  // yes, left turn
        const left = sameStart.findIndex(ss => headingForEdge(ss) === nextHeading);
        if (left >= 0) {
          edge = sameStart[left];
          sameStart.splice(left, 1);
          const n = e.findIndex(t => t === edge);
          e.splice(n, 1);
        }
      }
      if (edge == null) {
        throw new Error(`Could not turn left ${startKey}: ${sameStart.map(q => printEdge(q)).join(", ")}`);
      }
    }
  }
  return rr;
}
