import {BlockLayoutBounds} from "../template/ScreenText";
import {
	CARDINAL_OFFSETS,
	CARDINAL_OPPOSITE,
	JOIN_CARDINALS_DEFAULT,
	NineGridCardinal,
	SvgFromShape,
	Tile,
	TILE_LAYERS,
	TileLayer,
	TileRenderer
} from "../template/TileSet";
import {addIfNotIncluded} from "./addIfNotIncluded";
import {computeIfAbsent} from "./computeIfAbsent";
import {edgesFromCell} from "./edgesFromCell";
import {graftEdges} from "./graftEdges";
import {groupBy} from "./groupBy";
import {idForCellAt, idForCellCoordinate} from "./idForCellAt";
import {lookupMapFrom} from "./lookupMapFrom";
import {ScreenMapCell, ScreenMapRenderable, ScreenMapRenderableType, ScreenMapShape} from "./MapTypes";
import {outlineEdges} from "./outlineEdges";
import {simplifyPath} from "./simplifyPath";
import {sortCells} from "./sortCells";

function aggregateShapes(
	tileCells: ScreenMapCell[],
	tile: Tile,
	layerId: TileLayer,
	svgFromShape: SvgFromShape,
	bounds: BlockLayoutBounds,
	aggregate: (cell: ScreenMapCell, shape: ScreenMapShape) => ScreenMapShape,
): ScreenMapShape[] {
	return Array.from(new Set<ScreenMapShape>(tileCells.map(cell => {
		if (cell.shape != null) {
			return cell.shape;
		}
		const shape: ScreenMapShape = {
			adjacencies: new Map<number, NineGridCardinal[]>(),
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
	allCellsById: Map<number, ScreenMapCell[]>,
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
	const alsoAdjacent = tile.alsoAdjacentTileNames || [];
	const layerCellsByKey: Map<number, ScreenMapCell> = lookupMapFrom(tileCells, cell => cell.id);
	// https://en.wikipedia.org/wiki/Flood_fill
	const offsets = (tile.joinCardinals || JOIN_CARDINALS_DEFAULT).map(cardinal => ({
		offset: CARDINAL_OFFSETS[cardinal],
		cardinal
	}));
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
				const key = idForCellAt(focus.coordinate.x + offset.offset.dx, focus.coordinate.y + offset.offset.dy);
				let adjacent = layerCellsByKey.get(key);
				if (adjacent == null) {
					if (alsoAdjacent.length > 0) {
						const anyAdjacent = (allCellsById.get(key) || []).find(cell => cell.tile != null && alsoAdjacent.includes(cell.tile.name)) != null;
						if (anyAdjacent) {
							addIfNotIncluded(computeIfAbsent(shape.adjacencies, focus.id, () => []), offset.cardinal);
							// console.log(`Also adjacent: ${focus.id} -> ${key} : ${offset.cardinal}`);
						}
					}
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
		const byId = lookupMapFrom(shape.cells, cell => idForCellCoordinate(cell.coordinate));
		shape.cells.forEach(a => {
			const ax = a.coordinate.x;
			const ay = a.coordinate.y;
			offsets.forEach(off => {
				const b = byId.get(idForCellAt(ax + off.offset.dx, ay + off.offset.dy));
				if (b != null) {
					addIfNotIncluded(computeIfAbsent(shape.adjacencies, a.id, () => []), off.cardinal);
					addIfNotIncluded(computeIfAbsent(shape.adjacencies, b.id, () => []), CARDINAL_OPPOSITE.get(off.cardinal as NineGridCardinal));
				}
			});
		});
		return shape;
	};
	return aggregateShapes(tileCells, tile, layerId, svgFromShape, bounds, aggregate);
}

function renderablesFromLayer(
	layerCells: ScreenMapCell[],
	allCellsById: Map<number, ScreenMapCell[]>,
	layerId: TileLayer,
	tiles: Tile[],
	bounds: BlockLayoutBounds,
): ScreenMapRenderable[] {
	return tiles.flatMap(tile => renderablesForLayerTile(tile, layerId, layerCells, allCellsById, bounds))
}

export function renderablesFromCellsAndTiles(
	cells: ScreenMapCell[],
	renderer: TileRenderer,
	tiles: Tile[],
	bounds: BlockLayoutBounds,
): ScreenMapRenderable[] {
	let backfilled = cells.flatMap(cell => cell.tile?.backfillCells == null ? [] : cell.tile?.backfillCells(cell, renderer));
	backfilled = backfilled.concat(...cells);
	const backfilledById = groupBy(backfilled, cell => cell.id);
	return TILE_LAYERS.flatMap(layerId => renderablesFromLayer(backfilled.filter(cell => cell.layer === layerId), backfilledById, layerId, tiles, bounds))
		.concat(...cells.filter(cell => cell.shape == null).sort(sortCells));
}
