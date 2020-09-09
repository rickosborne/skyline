import {BlockLayoutBounds} from "../template/ScreenText";
import {Coordinate} from "./MapTypes";

function expandMatte(coordinate: Coordinate, bounds: BlockLayoutBounds): Coordinate {
	let x = coordinate.x;
	let y = coordinate.y;
	if (x === bounds.left) {
		x -= 1;
	}
	if (x === bounds.right) {
		x += 1;
	}
	if (y === bounds.top) {
		y -= 1;
	}
	if (y === bounds.bottom) {
		y += 1;
	}
	return {x, y};
}

export function semiQuadraticPath(coords: Coordinate[], bounds: BlockLayoutBounds): string {
	let previousCoordinate: Coordinate | undefined = undefined;
	let fx = 0;
	let fy = 0;
	const d: string[] = [];
	for (let i = 0; i < coords.length; i++) {
		let pos = expandMatte(coords[i], bounds);
		let x = pos.x;
		let y = pos.y;
		let next = expandMatte(coords[(i + 1) % coords.length], bounds);
		const hx = (x + next.x) * 0.5;
		const hy = (y + next.y) * 0.5;
		if (i === 0) {
			d.push(`M${hx},${hy}`);
			fx = hx;
			fy = hy;
		} else {
			d.push(`Q${x},${y},${hx},${hy}`);
		}
		previousCoordinate = pos;
	}
	return d.concat(`Q${coords[0].x},${coords[0].y},${fx},${fy} z`).join(" ");
}
