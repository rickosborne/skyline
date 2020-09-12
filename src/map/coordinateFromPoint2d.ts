import {Coordinate} from "./MapTypes";
import {Point2D} from "./Point2D";

export function coordinateFromPoint2d(point: Point2D): Coordinate {
	return {x: point[0], y: point[1]};
}
