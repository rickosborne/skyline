import {h, JSX} from "preact";
import {Consumer} from "../engine/type/Type";
import {BlockLayoutBounds} from "../template/ScreenText";
import {TileRenderer} from "../template/TileSet";
import {spinalCase} from "../template/util";
import {INSET_DEFAULT} from "./mapConstants";
import {Coordinate, ScreenMapPointOfInterest, ScreenMapShape} from "./MapTypes";
import {midpointCell} from "./midpointCell";
import {rectilinearPath} from "./rectilinearPath";
import {semiQuadraticPath} from "./semiQuadraticPath";
import {traceShape} from "./traceShape";

export function pathFromOutline(
	coordinates: Coordinate[],
	title: string,
	className: string,
	bounds: BlockLayoutBounds,
	tracer: (points: Coordinate[], bounds: BlockLayoutBounds) => string = rectilinearPath,
	after?: Consumer<JSX.Element>
): JSX.Element {
	const path = <path d={tracer(coordinates, bounds)} class={className}>
		<title>{title}</title>
	</path>;
	if (after != null) {
		after(path);
	}
	return path;
}

export function svgHullOverlay(
	shape: ScreenMapShape,
	bounds: BlockLayoutBounds,
	inset: number = INSET_DEFAULT,
	after?: Consumer<JSX.Element>
): JSX.Element {
	const overlayClassName = spinalCase(shape.tile.name) + "-overlay";
	// const coordinates = traceShape(shape, inset);
	const paths = shape.outline.map(outline => pathFromOutline(outline, shape.tile.name, overlayClassName, bounds, () => semiQuadraticPath(traceShape(shape, inset), bounds), after));
	return paths.length === 1 ? paths[0] : <g class={overlayClassName + "-group"}>{paths}</g>;
	// return pathFromOutline(coordinates, shape.tile.name, spinalCase(shape.tile.name) + "-overlay", TracingStyle.Chaikin, after);
}

export function svgRoundedBlob(
	shape: ScreenMapShape,
	bounds: BlockLayoutBounds,
	after?: Consumer<JSX.Element>
): JSX.Element {
	const caseName = spinalCase(shape.tile.name);
	return <g class={caseName + "-group"}>
		{shape.outline.flatMap(outline => {
			// const traced = traceShape(shape, 0);
			return [
				pathFromOutline(outline, shape.tile.name, caseName + "-back", bounds, rectilinearPath, after),
				pathFromOutline(outline, shape.tile.name, caseName + "-round", bounds, semiQuadraticPath, after),
			];
		})}
	</g>;
}

export function svgBoxyBlob(
	shape: ScreenMapShape,
	bounds: BlockLayoutBounds,
	after?: Consumer<JSX.Element>
): JSX.Element {
	return <g class={spinalCase(shape.tile.name) + "-group"}>
		{shape.outline.map(outline => pathFromOutline(outline, shape.tile.name, spinalCase(shape.tile.name) + "-box", bounds, undefined, after))}
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
