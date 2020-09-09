import {coordinateFromPoint2d} from "./coordinateFromPoint2d";
import {Coordinate} from "./MapTypes";
import * as gsc from "@thi.ng/geom-subdiv-curve";
import {point2dFromCoordinate} from "./point2dFromCoordinate";

export function chaikinPolygon(points: Coordinate[]): Coordinate[] {
	return gsc.subdivide(
		points.map(point2dFromCoordinate),
		gsc.SUBDIV_CHAIKIN_CLOSED,
	).map(coordinateFromPoint2d);
}
