import {Coordinate} from "./MapTypes";

export function sortCoordinates(a: Coordinate, b: Coordinate): number {
  return a.y === b.y ? a.x - b.x : a.y - b.y;
}
