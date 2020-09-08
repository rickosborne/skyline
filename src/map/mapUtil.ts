import {grahamScan2} from "@thi.ng/geom-hull";
import {Type} from "../engine/type/Type";
import {BlockLayoutBounds} from "../template/ScreenText";
import {
	CARDINAL_OFFSETS,
	COMPASS_FROM_DX_DY,
	COMPASS_NEXT_LH,
	CompassPoint,
	JOIN_CARDINALS_DEFAULT,
	Tile,
	TILE_LAYERS,
	TileLayer,
	TileRenderer
} from "../template/TileSet";
import {
	CellGenerationContext,
	Coordinate,
	isShape,
	ScreenMapCell,
	ScreenMapEnvironmentItem,
	ScreenMapPointOfInterest,
	ScreenMapRenderable,
	ScreenMapRenderableType,
	ScreenMapShape
} from "./MapTypes";

export const INSET_DEFAULT = 0.1;

export type Point2D = [number, number];

export interface Edge {
	s?: string;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

export function boundingBox(coordinates: ScreenMapShape | Coordinate[]): BlockLayoutBounds {
	const coords = isShape(coordinates) ? coordinates.cells.map(c => c.coordinate) : coordinates;
	return coords.reduce((b, c) => {
		if (b.left == null || b.left > c.x) {
			b.left = c.x;
		}
		if (b.right == null || b.right < c.x) {
			b.right = c.x;
		}
		if (b.top == null || b.top > c.y) {
			b.top = c.y;
		}
		if (b.bottom == null || b.bottom < c.y) {
			b.bottom = c.y;
		}
		return b;
	}, {} as Partial<BlockLayoutBounds>) as BlockLayoutBounds;
}

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
	layer?: TileLayer,
): ScreenMapCell {
	const tile = context.tilesByName[envItem.type];
	if (tile == null) {
		throw new Error(`No tile named "${envItem.type}" for Environment symbol "${symbol}" in tile set "${context.tileSet.name}" at (${x}, ${y}).`);
	}
	const result: ScreenMapCell = {
		coordinate: {x, y},
		layer: layer || tile.layer || TileLayer.Background,
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
			results.push(cellsFromEnv(envItem, poi.symbol, x, y, poi, context, TileLayer.Background));
		}
	} else if (poi.tile != null) {
		envItem = envItem || context.environment.find(e => e.type === poi.tile);
		tile = tile || context.tilesByName[poi.tile];
		results.push(cellsFromTile(tile, symbol, x, y, TileLayer.Background));
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

export function midpointCell(cells: ScreenMapCell[]): { cell: ScreenMapCell; xMid: number, yMid: number; } {
	const coordinates = traceShape(cells, 0);
	const bounds = boundingBox(coordinates);
	const width = bounds.right - bounds.left;
	const height = bounds.bottom - bounds.top;
	const xMid = (width * 0.5) + bounds.left;
	const yMid = (height * 0.5) + bounds.top;
	const midDistance: (cell: ScreenMapCell) => number = cell => Math.sqrt(Math.pow(cell.coordinate.x - xMid, 2) + Math.pow(cell.coordinate.y - yMid, 2));
	const cell = cells.reduce((mid, cell) => {
		const distance = midDistance(cell);
		if (distance < mid.distance) {
			return {distance, cell};
		}
		return mid;
	}, {distance: midDistance(cells[0]), cell: cells[0]}).cell;
	return {cell, xMid, yMid};
}

export function edgesFromCell(cell: ScreenMapCell): Edge[] {
	const x = cell.coordinate.x;
	const y = cell.coordinate.y;
	const s = `${x},${y}`;
	const nw = cell.coordinate;
	const ne = {x: x + 1, y};
	const se = {x: x + 1, y: y + 1};
	const sw = {x, y: y + 1};
	return [
		{x1: nw.x, y1: nw.y, x2: ne.x, y2: ne.y, s},
		{x1: ne.x, y1: ne.y, x2: se.x, y2: se.y, s},
		{x1: se.x, y1: se.y, x2: sw.x, y2: sw.y, s},
		{x1: sw.x, y1: sw.y, x2: nw.x, y2: nw.y, s},
	];
}

export function printEdge(edge: Edge): string {
	return `(${edge.x1},${edge.y1})->(${edge.x2},${edge.y2})${edge.s == null ? "" : `/${edge.s}`}`;
}

export function graftEdges(target: Edge[], addition: Edge[]): void {
	const toAdd: Edge[] = [];
	for (let a of addition) {
		const n = target.findIndex(t => t.x1 === a.x2 && t.x2 === a.x1 && t.y1 === a.y2 && t.y2 === a.y1);
		if (n < 0) {
			toAdd.push(a);
			// console.log(`Adding edge: ${printEdge(a)} to ${target.length}`);
		} else {
			// console.log(`Remove edge: ${printEdge(target[n])} because ${printEdge(a)} to ${target.length}`);
			target.splice(n, 1);
		}
	}
	target.push(...toAdd);
}

export function groupBy<K, V>(start: V[], keyGen: (value: V) => K): Map<K, V[]> {
	return start.reduce((values, value) => {
		const key = keyGen(value);
		let list = values.get(key);
		if (list == null) {
			list = [];
			values.set(key, list);
		}
		list.push(value);
		return values;
	}, new Map<K, V[]>());
}

export function headingForEdge(edge: Edge): CompassPoint {
	const dx = edge.x2 - edge.x1;
	const dy = edge.y2 - edge.y1;
	return COMPASS_FROM_DX_DY[dx][dy];
}

export function outlineEdges(edges: Edge[]): Coordinate[][] {
	const edgeKey = (edge: Edge) => `${edge.x1},${edge.y1}`;
	const edgesByStart = groupBy(edges, edgeKey);
	const e: Edge[] = ([] as Edge[]).concat(...edges);
	let r: Coordinate[] = [];
	const rr: Coordinate[][] = [r];
	let edge = e.shift();
	if (edge != null) {
		r.push({x: edge.x1, y: edge.y1});
	}
	while (edge != null) {
		const x = edge.x2;
		const y = edge.y2;
		r.push({x, y});
		const startKey = `${x},${y}`;
		const sameStart = edgesByStart.get(startKey);
		if (sameStart == null || sameStart.length === 0) {
			if (e.length > 0) {
				edge = e.shift() as Edge;
				r = [{x: edge.x1, y: edge.y1}];
				rr.push(r);
				const thisStart = edgesByStart.get(edgeKey(edge)) as Edge[];
				thisStart.splice(thisStart.findIndex(t => t === edge), 1);
			} else {
				break;
			}
		} else if (sameStart.length === 1) {
			edge = sameStart.shift();
			const n = e.findIndex(t => t === edge);
			e.splice(n, 1);
		} else {
			let heading = headingForEdge(edge);
			edge = undefined;
			for (let i = 0; i < 4 && edge == null; i++) {
				let nextHeading = COMPASS_NEXT_LH[heading];  // yes, left turn
				const left = sameStart.findIndex(ss => headingForEdge(ss) === nextHeading);
				if (left >= 0) {
					edge = sameStart[left];
					sameStart.splice(left, 1);
					const n = e.findIndex(t => t === edge);
					e.splice(n, 1);
				}
			}
			if (edge == null) {
				throw new Error(`Could not turn left ${startKey}: ${sameStart.map(q => printEdge(q)).join(", ")}`);
			}
		}
	}
	return rr;
}

export function renderablesFromCellsAndTiles(
	cells: ScreenMapCell[],
	renderer: TileRenderer,
	tiles: Tile[]
): ScreenMapRenderable[] {
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
			const svgFromShapeFactory = tile.svgFromShape;
			if (svgFromShapeFactory == null) {
				continue;
			}
			const svgFromShape = svgFromShapeFactory(layerId);
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
					throw new Error(`Don't know how to graft two shapes!`);
				}
				cell.shape = shape;
				shape.cells.push(cell);
				const todo: ScreenMapCell[] = [cell];
				let focus: ScreenMapCell | undefined;
				const processedKeys = new Set<string>();
				processedKeys.add(keyForLocation(cell.coordinate.x, cell.coordinate.y));
				while ((focus = todo.shift())) {
					for (let offset of offsets) {
						// iterations++;
						const key = keyForLocation(focus.coordinate.x + offset.dx, focus.coordinate.y + offset.dy);
						if (processedKeys.has(key)) {
							continue;
						}
						processedKeys.add(key);
						const adjacent = layerCellsByKey.get(key);
						if (adjacent != null && adjacent.tile === tile && adjacent.shape == null) {
							adjacent.shape = shape;
							shape.cells.push(adjacent);
							graftEdges(shape.edges, edgesFromCell(adjacent));
							todo.push(adjacent);
						}
					}
				}
				try {
					shape.outline = outlineEdges(shape.edges);
				} catch (e) {
					console.error(`While building ${shape.tile.name}`);
					throw e;
				}
				return shape;
			};
			const shapes = Array.from(new Set<ScreenMapShape>(tileCells.map(cell => {
				if (cell.shape != null) {
					return cell.shape;
				}
				const shape: ScreenMapShape = {
					cells: [],
					edges: edgesFromCell(cell),
					outline: [],
					renderableType: ScreenMapRenderableType.Shape,
					tile,
					layer: layerId,
					toSvgElement: (renderer) => svgFromShape(shape, renderer),
				};
				return aggregate(cell, shape);
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

export function sortCells(a: ScreenMapCell, b: ScreenMapCell): number {
	return sortCoordinates(a.coordinate, b.coordinate);
}

export function sortCoordinates(a: Coordinate, b: Coordinate): number {
	return a.y === b.y ? a.x - b.x : a.y - b.y;
}

export function squareCoordinates(cells: ScreenMapCell[], inset: number = INSET_DEFAULT): Coordinate[] {
	return cells.flatMap(cell => {
		const x = cell.coordinate.x;
		const y = cell.coordinate.y;
		return [
			{x: x + inset, y: y + inset},
			{x: x + 1 - inset, y: y + inset},
			{x: x + inset, y: y + 1 - inset},
			{x: x + 1 - inset, y: y + 1 - inset},
		];
	})
}

export function squarePoints(cells: ScreenMapCell[], inset: number = INSET_DEFAULT): Point2D[] {
	return squareCoordinates(cells, inset).map(c => [c.x, c.y]);
}

export function traceShape(shape: ScreenMapShape | ScreenMapCell[], inset: number = INSET_DEFAULT): Coordinate[] {
	const cells: ScreenMapCell[] = isShape(shape) ? shape.cells : shape;
	if (cells.length === 0) {
		return [];
	}
	const points = squarePoints(cells, inset);
	const bounds = grahamScan2(points)
	return bounds.map((point: Point2D) => ({x: point[0], y: point[1]}));
}
