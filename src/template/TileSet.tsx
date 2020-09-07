import * as CSS from "csstype";
import * as Jimp from "jimp";
import {h, JSX} from "preact";
import {lpad} from "../engine/EngineConfig";
import {Consumer} from "../engine/type/Type";
import {Coordinate, ScreenMapEnvironmentItem, ScreenMapPointOfInterest} from "./ScreenMap";

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

// const transparentBlack = Jimp.rgbaToInt(0, 0, 0, 0);
export const transparentWhite = Jimp.rgbaToInt(255, 255, 255, 0);

export function rgb(red: number, green: number, blue: number): number {
	return Jimp.rgbaToInt(red, green, blue, 255);
}

export function hexFromRGB(red: number, green: number, blue: number, alpha?: number): string {
	return [
		"#",
		lpad(red.toString(16), 2, "0"),
		lpad(green.toString(16), 2, "0"),
		lpad(blue.toString(16), 2, "0"),
		alpha == null ? "" : lpad(alpha.toString(16), 2, "0"),
	].join("");
}

export function hexFromNum(rgb: number): string {
	return `#${lpad(rgb.toString(16), 8, "0")}`;
	// const rgba = Jimp.intToRGBA(rgb);
	// if (rgba.a === 255) {
	// 	return "transparent";
	// } else if (rgba.a > 0) {
	// 	return `#${lpad(rgba.r.toString(16), 2, "0")}${lpad(rgba.g.toString(16), 2, "0")}${lpad(rgba.b.toString(16), 2, "0")}${lpad(rgba.a.toString(16), 2, "0")}`;
	// } else {
	// 	return `#${lpad(rgba.r.toString(16), 2, "0")}${lpad(rgba.g.toString(16), 2, "0")}${lpad(rgba.b.toString(16), 2, "0")}`;
	// }
}

export interface Tile {
	color: string;
	layer: TileLayer;
	name: string;
	toStyles?: () => Record<string, CSS.PropertiesHyphen>;
	toSvgElement?: (coordinate: Coordinate, renderer: TileRenderer, envItem: ScreenMapEnvironmentItem | undefined) => JSX.Element;
	toSvgSymbols?: () => JSX.Element | JSX.Element[];
}

export interface TileSet {
	backgroundColor: number;
	name: string;
	poiBackgroundColor: string;
	poiBorderColor: string;
	poiColor: string;
	poiFont: string;
	svgElementFromPoint?: (coordinate: Coordinate, renderer: TileRenderer, point: ScreenMapPointOfInterest, envItem?: ScreenMapEnvironmentItem, tile?: Tile) => JSX.Element;
	tiles: Tile[];

	isAmbient(symbol: string): boolean;
}

// noinspection SpellCheckingInspection
export const FONT_SANS_DEFAULT = "Roboto, \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif";

export interface TileRenderer {
	genericPoi: (coordinate: Coordinate, point: ScreenMapPointOfInterest) => JSX.Element;
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

export type NineGridCardinal = "NW" | "N" | "NE" | "E" | "SE" | "S" | "SW" | "W";
export type CoordinateOffset = { dx: number; dy: number };
export const CARDINAL_POINTS: NineGridCardinal[] = ["NW", "N", "NE", "E", "SE", "S", "SW", "W"];
export const FOUR_POINTS: NineGridCardinal[] = CARDINAL_POINTS.filter(dir => dir.length === 1);
export const FOUR_POINTS_LOWER = FOUR_POINTS.map(dir => dir.toLowerCase());
export const DIAGONAL_POINTS = CARDINAL_POINTS.filter(dir => dir.length === 2);
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

