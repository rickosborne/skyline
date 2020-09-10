import {BlockLayoutBounds} from "../template/ScreenText";
import {
	CARDINAL_FROM_DX_DY,
	CARDINAL_PREV, CARDINAL_PREV2,
	CoordinateOffset,
	NineGridCardinal,
	sortByCardinal
} from "../template/TileSet";
import {computeIfAbsent} from "./computeIfAbsent";
import {lookupMapFrom} from "./lookupMapFrom";
import {Coordinate, ScreenMapCell, ScreenMapShape} from "./MapTypes";

export interface JourneyStep {
	cells: ScreenMapCell[];
	center: Coordinate;
	next: JourneyLink[];
	width: number;
}

export interface JourneyLink {
	heading: number;
	step: JourneyStep;
}

const BORDER_POINT_IN: Record<NineGridCardinal, CoordinateOffset> = {
	N: {dx: 0.3, dy: 0},
	NE: {dx: 0.7, dy: 0},
	E: {dx: 1, dy: 0.3},
	SE: {dx: 1, dy: 0.7},
	S: {dx: 0.7, dy: 1},
	SW: {dx: 0.3, dy: 1},
	W: {dx: 0, dy: 0.7},
	NW: {dx: 0, dy: 0.3},
}

const BORDER_POINT_OUT: Record<NineGridCardinal, string> = {
	N: "h0.4",
	NE: "l0.17,-0.13 l0.26,0.26 l-0.13,0.17",
	E: "v0.4",
	SE: "l0.13,0.17 l-0.26,0.26 l-0.17,-0.13",
	S: "h-0.4",
	SW: "l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17",
	W: "v-0.4",
	NW: "l-0.13,-0.17 l0.26,-0.26 l0.17,0.13",
}

export function journeyPaths(shape: ScreenMapShape, bounds: BlockLayoutBounds): string[] {
	const cells = shape.cells;
	const adjacencies = Array.from(shape.adjacencies.entries()).reduce((prev, [id, adj]) => {
		prev.set(id, adj.slice());
		return prev;
	}, new Map<number, number[]>());
	const extendCell = (oid: number, n: number, x: number, y: number): void => {
		cells.push({id: n, coordinate: {x, y}} as ScreenMapCell);
		computeIfAbsent(adjacencies, oid, () => []).push(n);
		computeIfAbsent(adjacencies, n, () => []).push(oid);
	};
	shape.cells.forEach(cell => {
		const x = cell.coordinate.x;
		const y = cell.coordinate.y;
		if (x === bounds.left) {
			extendCell(cell.id, cell.id - 1, x - 1, y);
		}
		if (x === bounds.right - 1) {
			extendCell(cell.id, cell.id + 1, x + 1, y);
		}
		if (y === bounds.top) {
			extendCell(cell.id, parseFloat(`${x}.01`), x, y - 1);
		}
		if (y === bounds.bottom - 1) {
			extendCell(cell.id, parseFloat(`${x}.02`), x, y + 1);
		}
	});
	const cellsById: Map<number, ScreenMapCell> = lookupMapFrom(cells, cell => cell.id);
	return cells.map(cell => {
		const adjacentIds = adjacencies.get(cell.id) as number[];
		const adjacent = adjacentIds.map(cellId => cellsById.get(cellId) as ScreenMapCell);
		const x = cell.coordinate.x;
		const y = cell.coordinate.y;
		const midX = x + 0.5;
		const midY = y + 0.5;
		const cardinals = adjacent.map(next => CARDINAL_FROM_DX_DY.get(next.coordinate.x - x)?.get(next.coordinate.y - y) as NineGridCardinal).sort(sortByCardinal);
		cardinals.push(cardinals[0]);
		return cardinals.reduce(({p, d}, dir, index) => {
			const offIn = BORDER_POINT_IN[dir];
			const offOut = index === cardinals.length - 1 ? "" : BORDER_POINT_OUT[dir];
			if (p == null) {
				d.push(`M${x + offIn.dx},${y + offIn.dy} ${offOut}`);
			} else if (p === CARDINAL_PREV2[dir]) {
				d.push(`L${x + offIn.dx},${y + offIn.dy} ${offOut}`);
			} else if (p === CARDINAL_PREV[dir]) {
				d.push(offOut);
			} else {
				d.push(`Q${midX},${midY},${x + offIn.dx},${y + offIn.dy} ${offOut}`);
			}
			return {p: dir, d};
		}, {d: []} as {d: string[]; p?: NineGridCardinal}).d.join(" ") + "z";
	});
}

