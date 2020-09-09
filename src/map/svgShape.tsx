import {h, JSX} from "preact";
import {Consumer} from "../engine/type/Type";
import {TileRenderer} from "../template/TileSet";
import {spinalCase} from "../template/util";
import {Coordinate, ScreenMapPointOfInterest, ScreenMapShape} from "./MapTypes";
import {INSET_DEFAULT} from "./mapConstants";
import {midpointCell} from "./midpointCell";
import {rectilinearPath} from "./rectilinearPath";
import {traceShape} from "./traceShape";

export function pathFromOutline(coordinates: Coordinate[], title: string, className: string, after?: Consumer<JSX.Element>): JSX.Element {
	const path = <path d={rectilinearPath(coordinates)} class={className}>
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
