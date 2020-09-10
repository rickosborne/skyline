import {JSX} from "preact";
import {BlockLayoutBounds} from "../template/ScreenText";
import {
	CARDINAL_OFFSETS,
	JOIN_CARDINALS_DEFAULT,
	Tile,
	TILE_LAYERS,
	TileLayer,
	TileRenderer
} from "../template/TileSet";
import {addIfNotIncluded} from "./addIfNotIncluded";
import {computeIfAbsent} from "./computeIfAbsent";
import {edgesFromCell} from "./edgesFromCell";
import {graftEdges} from "./graftEdges";
import {idForCellAt} from "./idForCellAt";
import {lookupMapFrom} from "./lookupMapFrom";
import {ScreenMapCell, ScreenMapRenderable, ScreenMapRenderableType, ScreenMapShape} from "./MapTypes";
import {outlineEdges} from "./outlineEdges";
import {simplifyPath} from "./simplifyPath";
import {sortCells} from "./sortCells";

function aggregateShapes(
	tileCells: ScreenMapCell[],
	tile: Tile,
	layerId: TileLayer,
	svgFromShape: (shape: ScreenMapShape, renderer: TileRenderer, bounds: BlockLayoutBounds) => JSX.Element,
	bounds: BlockLayoutBounds,
	aggregate: (cell: ScreenMapCell, shape: ScreenMapShape) => ScreenMapShape,
): ScreenMapShape[] {
	return Array.from(new Set<ScreenMapShape>(tileCells.map(cell => {
		if (cell.shape != null) {
			return cell.shape;
		}
		const shape: ScreenMapShape = {
			adjacencies: new Map<number, number[]>(),
			cells: [],
			edges: edgesFromCell(cell),
			outline: [],
			renderableType: ScreenMapRenderableType.Shape,
			tile,
			layer: layerId,
			toSvgElement: (renderer) => svgFromShape(shape, renderer, bounds),
		};
		return aggregate(cell, shape);
	}).filter(shape => shape.cells.length > 0)).keys()).map(shape => {
		shape.cells.sort(sortCells);
		return shape;
	});
}

function renderablesForLayerTile(
	tile: Tile,
	layerId: TileLayer,
	layerCells: ScreenMapCell[],
	bounds: BlockLayoutBounds,
) {
	const svgFromShapeFactory = tile.svgFromShape;
	if (svgFromShapeFactory == null) {
		return [];
	}
	const svgFromShape = svgFromShapeFactory(layerId);
	const tileCells = layerCells.filter(cell => cell.tile === tile);
	if (tileCells.length === 0) {
		return [];
	}
	const layerCellsByKey: Map<number, ScreenMapCell> = lookupMapFrom(tileCells, cell => cell.id);
	// https://en.wikipedia.org/wiki/Flood_fill
	const offsets = (tile.joinCardinals || JOIN_CARDINALS_DEFAULT).map(cardinal => CARDINAL_OFFSETS[cardinal]);
	const aggregate: (cell: ScreenMapCell, shape: ScreenMapShape) => ScreenMapShape = (cell, shape): ScreenMapShape => {
		if (cell.tile !== tile || cell.shape === shape) {
			// iterations++;
			return shape;
		}
		if (cell.shape != null) {
			throw new Error(`Don't know how to graft two shapes!`);
		}
		cell.shape = shape;
		shape.cells.push(cell);
		const todo: ScreenMapCell[] = [cell];
		let focus: ScreenMapCell | undefined;
		const processedKeys = new Set<number>();
		processedKeys.add(cell.id);
		while ((focus = todo.shift())) {
			for (let offset of offsets) {
				const key = idForCellAt(focus.coordinate.x + offset.dx, focus.coordinate.y + offset.dy);
				let adjacent = layerCellsByKey.get(key);
				if (adjacent == null || adjacent.tile !== tile) {
					continue;
				}
				if (adjacent.shape == null) {
					// addIfNotIncluded(computeIfAbsent(shape.adjacencies, adjacent.id, () => []), focus.id);
					// addIfNotIncluded(computeIfAbsent(shape.adjacencies, focus.id, () => []), adjacent.id);
					if (!processedKeys.has(key)) {
						processedKeys.add(key);
						adjacent.shape = shape;
						shape.cells.push(adjacent);
						graftEdges(shape.edges, edgesFromCell(adjacent));
						todo.push(adjacent);
					}
				}
			}
		}
		try {
			shape.outline = outlineEdges(shape.edges).map(path => simplifyPath(path));
		} catch (e) {
			console.error(`While building ${shape.tile.name}`);
			throw e;
		}
		shape.cells.forEach(a => {
			const ax = a.coordinate.x;
			const ay = a.coordinate.y;
			shape.cells.filter(b => Math.abs(b.coordinate.x - ax) <= 1 && Math.abs(b.coordinate.y - ay) <= 1 && (ax !== b.coordinate.x || ay !== b.coordinate.y)).forEach(b => {
				addIfNotIncluded(computeIfAbsent(shape.adjacencies, a.id, () => []), b.id);
				addIfNotIncluded(computeIfAbsent(shape.adjacencies, b.id, () => []), a.id);
			});
		});
		return shape;
	};
	return aggregateShapes(tileCells, tile, layerId, svgFromShape, bounds, aggregate);
}

function renderablesFromLayer(
	layerCells: ScreenMapCell[],
	layerId: TileLayer,
	tiles: Tile[],
	bounds: BlockLayoutBounds,
): ScreenMapRenderable[] {
	return tiles.flatMap(tile => renderablesForLayerTile(tile, layerId, layerCells, bounds))
}

export function renderablesFromCellsAndTiles(
	cells: ScreenMapCell[],
	renderer: TileRenderer,
	tiles: Tile[],
	bounds: BlockLayoutBounds,
): ScreenMapRenderable[] {
	return TILE_LAYERS.flatMap(layerId => renderablesFromLayer(cells.filter(cell => cell.layer === layerId), layerId, tiles, bounds))
		.concat(...cells.filter(cell => cell.shape == null).sort(sortCells));
}
