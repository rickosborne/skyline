import {Coordinate} from "./MapTypes";
import {Point2D} from "./Point2D";

export function point2dFromCoordinate(coordinate: Coordinate): Point2D {
	return [coordinate.x, coordinate.y];
}
