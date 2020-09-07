import {Type} from "../engine/type/Type";
import {
	CARDINAL_OFFSETS,
	JOIN_CARDINALS_DEFAULT,
	Tile,
	TILE_LAYERS,
	TileLayer,
	TileRenderer
} from "../template/TileSet";
import {
	CellGenerationContext,
	Coordinate,
	ScreenMapCell,
	ScreenMapEnvironmentItem,
	ScreenMapPointOfInterest,
	ScreenMapRenderable,
	ScreenMapRenderableType,
	ScreenMapShape
} from "./MapTypes";

export function cellsFromMapLines(
	mapLines: string[],
	context: CellGenerationContext,
): ScreenMapCell[] {
	return mapLines.flatMap((line, y) => line.split("").flatMap((symbol, x): undefined | ScreenMapCell | ScreenMapCell[] => {
		return cellsFromSymbol(symbol, x, y, context);
	})).filter(Type.isNotNull) as ScreenMapCell[]
}

export function cellsFromEnv(
	envItem: ScreenMapEnvironmentItem,
	symbol: string,
	x: number,
	y: number,
	poiItem: ScreenMapPointOfInterest | undefined,
	context: CellGenerationContext,
): ScreenMapCell {
	const tile = context.tilesByName[envItem.type];
	if (tile == null) {
		throw new Error(`No tile named "${envItem.type}" for Environment symbol "${symbol}" at (${x}, ${y}).`);
	}
	const result: ScreenMapCell = {
		coordinate: {x, y},
		layer: tile.layer || TileLayer.Background,
		envItem,
		tile,
		symbol,
		renderableType: ScreenMapRenderableType.Cell,
	};
	if (poiItem != null) {
		result.poi = poiItem;
	}
	return result;
}

export function cellsFromPoi(
	poi: ScreenMapPointOfInterest,
	symbol: string,
	x: number,
	y: number,
	context: CellGenerationContext,
): ScreenMapCell[] {
	const results: ScreenMapCell[] = [];
	let envItem: ScreenMapEnvironmentItem | undefined;
	let tile: Tile | undefined;
	if (poi.symbol != null && poi.symbol !== symbol) {
		results.push(...cellsFromSymbol(poi.symbol, x, y, context));
		envItem = context.envBySymbol[poi.symbol];
		if (envItem != null) {
			tile = context.tilesByName[envItem.type];
		}
	}
	if (poi.tile != null) {
		envItem = envItem || context.environment.find(e => e.type === poi.tile);
		tile = tile || context.tilesByName[poi.tile];
	}
	if (poi.overlay != null) {
		const overlayTile = context.tilesByName[poi.overlay];
		if (overlayTile == null) {
			throw new Error(`No such overlay tile "${poi.overlay}" at "${poi.id}. ${poi.title}"`);
		}
		results.push(cellsFromTile(overlayTile, symbol, x, y, TileLayer.Overlay));
	}
	const result: ScreenMapCell = {
		coordinate: {x, y},
		layer: TileLayer.PointsOfInterest,
		poi,
		symbol,
		renderableType: ScreenMapRenderableType.Cell,
	}
	if (envItem != null) {
		result.envItem = envItem;
	}
	if (tile != null) {
		result.tile = tile;
	}
	if (context.tileSet.backfillCells != null) {
		results.push(...context.tileSet.backfillCells(result));
	}
	results.push(result);
	return results;
}

export function cellsFromSymbol(
	symbol: string,
	x: number,
	y: number,
	context: CellGenerationContext,
): ScreenMapCell[] {
	const results: ScreenMapCell[] = [];
	const poiItem = context.poiBySymbol[symbol];
	if (context.tileSet.isAmbient(symbol)) {
		return results;
	}
	if (poiItem != null) {
		results.push(...cellsFromPoi(poiItem, symbol, x, y, context));
	}
	const envItem = context.envBySymbol[symbol];
	if (envItem != null) {
		results.push(cellsFromEnv(envItem, symbol, x, y, poiItem, context));
	}
	return results;
}

export function sortCells(a: ScreenMapCell, b: ScreenMapCell): number {
	return sortCoordinates(a.coordinate, b.coordinate);
}

export function sortCoordinates(a: Coordinate, b: Coordinate): number {
	return a.y === b.y ? a.x - b.x : a.y - b.y;
}

export function cellsFromTile(
	tile: Tile,
	symbol: string,
	x: number,
	y: number,
	layer: TileLayer = TileLayer.Background
): ScreenMapCell {
	return {
		coordinate: {x, y},
		layer,
		tile,
		symbol,
		renderableType: ScreenMapRenderableType.Cell,
	};
}

export function renderablesFromCellsAndTiles(cells: ScreenMapCell[], renderer: TileRenderer, tiles: Tile[]) {
	const keyForLocation: (x: number, y: number) => string = (x, y) => `${x},${y}`;
	const renderables: ScreenMapRenderable[] = [];
	// let iterations = 0;
	for (let layerId of TILE_LAYERS) {
		const layerCells = cells.filter(cell => cell.layer === layerId);
		const layerCellsByKey = layerCells.reduce((cells, cell) => {
			const key = keyForLocation(cell.coordinate.x, cell.coordinate.y);
			const existing = cells.get(key);
			if (existing != null) {
				throw new Error(`Multiple cells at ${key} on layer ${layerId}: ${JSON.stringify([existing, cell])}`);
			}
			cells.set(key, cell);
			return cells;
		}, new Map<string, ScreenMapCell>());
		for (let tile of tiles) {
			const tileCells = layerCells.filter(cell => cell.tile === tile);
			if (tileCells.length === 0) {
				continue;
			}
			// https://en.wikipedia.org/wiki/Flood_fill
			const offsets = (tile.joinCardinals || JOIN_CARDINALS_DEFAULT).map(cardinal => CARDINAL_OFFSETS[cardinal]);
			const aggregate: (cell: ScreenMapCell, shape: ScreenMapShape) => ScreenMapShape = (cell, shape): ScreenMapShape => {
				if (cell.tile !== tile || cell.shape === shape) {
					// iterations++;
					return shape;
				}
				if (cell.shape != null) {
					shape.cells.push(...cell.shape.cells);
					cell.shape.cells.forEach(cell => cell.shape = shape);
					cell.shape.cells.splice(0, cell.shape.cells.length);
				}
				const todo: ScreenMapCell[] = [cell];
				let focus: ScreenMapCell | undefined;
				while ((focus = todo.shift())) {
					for (let offset of offsets) {
						// iterations++;
						const key = keyForLocation(focus.coordinate.x + offset.dx, focus.coordinate.y + offset.dy);
						const adjacent = layerCellsByKey.get(key);
						if (adjacent != null && adjacent.tile === tile && adjacent.shape == null) {
							adjacent.shape = shape;
							shape.cells.push(adjacent)
							todo.push(adjacent);
						}
					}
				}
				return shape;
			};
			const shapes = Array.from(new Set<ScreenMapShape>(tileCells.map(cell => {
				return cell.shape != null ? cell.shape : aggregate(cell, {
					cells: [],
					renderableType: ScreenMapRenderableType.Shape,
					tile,
					layer: layerId,
				});
			}).filter(shape => shape.cells.length > 0)).keys()).map(shape => {
				shape.cells.sort(sortCells);
				return shape;
			});
			renderables.push(...shapes);
		}
	}
	renderables.push(...cells.filter(cell => cell.shape == null).sort(sortCells));
	// console.log(`renderablesFromCellsAndTiles ${iterations} iterations for ${cells.length} cells`)
	return renderables;
}
