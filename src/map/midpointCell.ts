import {boundingBox} from "./boundingBox";
import {ScreenMapCell} from "./MapTypes";
import {traceShape} from "./traceShape";

export function midpointCell(cells: ScreenMapCell[]): { cell: ScreenMapCell; xMid: number, yMid: number; } {
  const coordinates = traceShape(cells, 0);
  const bounds = boundingBox(coordinates);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const xMid = (width * 0.5) + bounds.left;
  const yMid = (height * 0.5) + bounds.top;
  const midDistance: (cell: ScreenMapCell) => number = cell => Math.sqrt(Math.pow(cell.coordinate.x - xMid, 2) + Math.pow(cell.coordinate.y - yMid, 2));
  const cell = cells.reduce((mid, cell) => {
    const distance = midDistance(cell);
    if (distance < mid.distance) {
      return {distance, cell};
    }
    return mid;
  }, {distance: midDistance(cells[0]), cell: cells[0]}).cell;
  return {cell, xMid, yMid};
}
