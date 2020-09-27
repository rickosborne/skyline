import {Coordinate} from "./MapTypes";

export function idForCellAt(x: number, y: number): number {
	return x + (y / 1000);
	// return parseFloat(`${x}.${y}`);
}

export function idForCellCoordinate(coordinate: Coordinate): number {
	return coordinate.x + (coordinate.y / 1000);
	// return parseFloat(`${Math.floor(coordinate.x)}.${Math.floor(coordinate.y)}`);
}
