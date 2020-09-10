import {Coordinate} from "./MapTypes";

export function idForCellAt(x: number, y: number): number {
	return parseFloat(`${x}.${y}`);
}

export function idForCellCoordinate(coordinate: Coordinate): number {
	return parseFloat(`${Math.floor(coordinate.x)}.${Math.floor(coordinate.y)}`);
}
