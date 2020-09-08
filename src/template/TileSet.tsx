import * as CSS from "csstype";
import {h, JSX} from "preact";
import {lpad} from "../engine/EngineConfig";
import {Consumer} from "../engine/type/Type";
import {
	Coordinate,
	ScreenMapCell,
	ScreenMapEnvironmentItem,
	ScreenMapPointOfInterest,
	ScreenMapRenderable,
	ScreenMapShape
} from "../map/MapTypes";

export enum TileLayer {
	Background = "B",
	Overlay = "O",
	Interact = "I",
	PointsOfInterest = "P",
}

export const TILE_LAYERS: TileLayer[] = [
	TileLayer.Background,
	TileLayer.Overlay,
	TileLayer.Interact,
	TileLayer.PointsOfInterest,
];

export function hexFromRGB(red: number, green: number, blue: number, alpha?: number): string {
	return [
		"#",
		lpad(red.toString(16), 2, "0"),
		lpad(green.toString(16), 2, "0"),
		lpad(blue.toString(16), 2, "0"),
		alpha == null ? "" : lpad(alpha.toString(16), 2, "0"),
	].join("");
}

export type SvgFromShape = (shape: ScreenMapShape, renderer: TileRenderer) => JSX.Element;
export type SvgFromShapeAndLayer = (layer: TileLayer) => SvgFromShape;

export interface Tile {
	color: string;
	joinCardinals?: NineGridCardinal[];
	layer: TileLayer;
	name: string;
	svgFromShape?: SvgFromShapeAndLayer;
	toStyles?: () => Record<string, CSS.PropertiesHyphen>;
	toSvgElement?: (coordinate: Coordinate, renderer: TileRenderer, envItem: ScreenMapEnvironmentItem | undefined) => JSX.Element;
	toSvgSymbols?: () => JSX.Element | JSX.Element[];
}

export interface TileSet {
	backfillCells?: (cell: ScreenMapCell) => ScreenMapCell[];
	backgroundColor?: string;
	name: string;
	poiBackgroundColor: string;
	poiBorderColor: string;
	poiColor: string;
	poiFont: string;
	renderablesFromCells?: (cells: ScreenMapCell[], renderer: TileRenderer) => ScreenMapRenderable[];
	svgElementFromPoint?: (coordinate: Coordinate, renderer: TileRenderer, point: ScreenMapPointOfInterest, envItem?: ScreenMapEnvironmentItem, tile?: Tile) => JSX.Element;
	tiles: Tile[];

	isAmbient(symbol: string): boolean;
}

// noinspection SpellCheckingInspection
export const FONT_SANS_DEFAULT = "Roboto, \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif";

export interface TileRenderer {
	genericPoi: (coordinate: Coordinate, point: ScreenMapPointOfInterest) => JSX.Element;
	genericTile: (coordinate: Coordinate, tile: Tile) => JSX.Element;
	textAt: (coordinate: Coordinate, label: string, configurer?: Consumer<JSX.Element>) => JSX.Element;
	tileNameAt: (x: number, y: number) => string | undefined;
}

export interface NineGridDirection {
	absent?: Record<string, string>;
	present?: Record<string, string>;
}

export type NineGridReduce = {
	[P in NineGridCardinal]?: NineGridDirection;
}

export type CompassPoint = "N" | "E" | "S" | "W";
export type DiagonalPoint = "NW" | "NE" | "SE" | "SW";
export type NineGridCardinal = CompassPoint | DiagonalPoint;
export type CoordinateOffset = { dx: number; dy: number };
export const CARDINAL_POINTS: NineGridCardinal[] = ["NW", "N", "NE", "E", "SE", "S", "SW", "W"];
export const FOUR_POINTS: CompassPoint[] = ["N", "E", "S", "W"];
export const FOUR_POINTS_LOWER = FOUR_POINTS.map(dir => dir.toLowerCase());
export const DIAGONAL_POINTS = ["NW", "NE", "SE", "SW"];
export const DIAGONAL_POINTS_LOWER = DIAGONAL_POINTS.map(dir => dir.toLowerCase());
export const DIAGONAL_POINTS_LOWER_HV = DIAGONAL_POINTS_LOWER.map(dir => ({
	c: dir,
	h: dir.substr(0, 1),
	v: dir.substr(1, 1)
}));
export const CARDINAL_POINTS_LOWER = CARDINAL_POINTS.map(dir => dir.toLowerCase());
export const CARDINAL_OFFSETS: Record<NineGridCardinal, CoordinateOffset> = {
	NW: {dx: -1, dy: -1},
	N: {dx: 0, dy: -1},
	NE: {dx: 1, dy: -1},
	E: {dx: 1, dy: 0},
	SE: {dx: 1, dy: 1},
	S: {dx: 0, dy: 1},
	SW: {dx: -1, dy: 1},
	W: {dx: -1, dy: 0},
};
export const JOIN_CARDINALS_DEFAULT = FOUR_POINTS;
export const COMPASS_FROM_DX_DY: Record<number, Record<number, CompassPoint>> = {
	"0": {
		"-1": "S",
		"1": "N",
	},
	"1": {
		"0": "E"
	},
	"-1": {
		"0": "W",
	}
};
export const COMPASS_NEXT_RH: Record<CompassPoint, CompassPoint> = {
	N: "E",
	E: "S",
	S: "W",
	W: "N",
}
export const COMPASS_NEXT_LH: Record<CompassPoint, CompassPoint> = {
	N: "W",
	E: "N",
	S: "E",
	W: "S",
}

export function nineGridReduce(coordinate: Coordinate, renderer: TileRenderer, grid: NineGridReduce): string[] {
	return CARDINAL_POINTS.reduce((result, cardinal) => {
		const direction = grid[cardinal];
		if (direction != null) {
			const offset = CARDINAL_OFFSETS[cardinal];
			const name = renderer.tileNameAt(coordinate.x + offset.dx, coordinate.y + offset.dy);
			Object.entries(direction.present || {}).filter(([key]) => key === name).forEach(([, value]) => result.push(value));
			Object.entries(direction.absent || {}).filter(([key]) => key !== name).forEach(([, value]) => result.push(value));
		}
		return result;
	}, [] as string[]);
}

