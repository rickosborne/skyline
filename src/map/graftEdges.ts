import {Edge} from "./Edge";

export function graftEdges(target: Edge[], addition: Edge[]): void {
  const toAdd: Edge[] = [];
  for (let a of addition) {
    const n = target.findIndex(t => t.x1 === a.x2 && t.x2 === a.x1 && t.y1 === a.y2 && t.y2 === a.y1);
    if (n < 0) {
      toAdd.push(a);
      // console.log(`Adding edge: ${printEdge(a)} to ${target.length}`);
    } else {
      // console.log(`Remove edge: ${printEdge(target[n])} because ${printEdge(a)} to ${target.length}`);
      target.splice(n, 1);
    }
  }
  target.push(...toAdd);
}
