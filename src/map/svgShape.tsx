import {h, JSX} from "preact";
import {Consumer} from "../engine/type/Type";
import {TileRenderer} from "../template/TileSet";
import {spinalCase} from "../template/util";
import {Coordinate, ScreenMapPointOfInterest, ScreenMapShape} from "./MapTypes";
import {INSET_DEFAULT, midpointCell, traceShape} from "./mapUtil";

export function pathDirections(coordinates: Coordinate[]): string {
	return coordinates.reduce((state, pos, n) => {
		let step: string | undefined;
		let lastStep: boolean = false;
		if (state.prev == null) {
			step = `M${pos.x},${pos.y}`;
		} else {
			let dx = pos.x - state.prev.x;
			let dy = pos.y - state.prev.y;
			if (dx === 0 && dy === 0) {
				step = undefined;
			} else if (dx === 0) {
				if (state.pdx === 0 && state.pdy != null) {
					dy += state.pdy;
					lastStep = true;
				}
				step = `v${dy}`;
			} else if (dy === 0) {
				if (state.pdy === 0 && state.pdx != null) {
					dx += state.pdx;
					lastStep = true;
				} else {
				}
				step = `h${dx}`;
			} else {
				step = `l${dx},${dy}`;
			}
			state.pdx = dx;
			state.pdy = dy;
		}
		if (step != null) {
			if (lastStep) {
				state.steps[state.steps.length - 1] = step;
			} else {
				state.steps.push(step);
			}
		}
		if (n === coordinates.length - 1) {
			state.steps.push("z");
		}
		state.prev = pos;
		return state;
	}, {prev: undefined, steps: []} as { prev?: Coordinate; steps: string[]; pdx?: number; pdy?: number; }).steps.join(" ");
}

export function pathFromOutline(coordinates: Coordinate[], title: string, className: string, after?: Consumer<JSX.Element>): JSX.Element {
	const path = <path d={pathDirections(coordinates)} class={className}>
		<title>{title}</title>
	</path>;
	if (after != null) {
		after(path);
	}
	return path;
}

export function svgHullOverlay(shape: ScreenMapShape, inset: number = INSET_DEFAULT, after?: Consumer<JSX.Element>): JSX.Element {
	const coordinates = traceShape(shape, inset);
	return pathFromOutline(coordinates, shape.tile.name, spinalCase(shape.tile.name) + "-overlay", after);
}

export function svgBoxyBlob(shape: ScreenMapShape, after?: Consumer<JSX.Element>): JSX.Element {
	return <g class={spinalCase(shape.tile.name) + "-group"}>
		{shape.outline.map(outline => pathFromOutline(outline, shape.tile.name, spinalCase(shape.tile.name) + "-box", after))}
	</g>;
}

export function singlePoi(shape: ScreenMapShape, renderer: TileRenderer): JSX.Element {
	const {cell, xMid, yMid} = midpointCell(shape.cells);
	let coordinate: Coordinate = cell.coordinate;
	if (xMid >= coordinate.x && xMid <= (coordinate.x + 1) && yMid >= coordinate.y && yMid <= (coordinate.y + 1)) {
		coordinate = {x: xMid - 0.5, y: yMid - 0.5};
	}
	return renderer.genericPoi(coordinate, cell.poi as ScreenMapPointOfInterest);
}

export function svgSquaresFromShape(shape: ScreenMapShape, renderer: TileRenderer): JSX.Element {
	return <g class={shape.tile.name + "-squares"}>
		{shape.cells.map(cell => renderer.genericTile(cell, shape.tile))}
	</g>
}
