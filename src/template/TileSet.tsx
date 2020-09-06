import * as CSS from "csstype";
import * as Jimp from "jimp";
import {h, JSX} from "preact";
import {lpad} from "../engine/EngineConfig";
import {html} from "./hypertext";
import {Coordinate} from "./ScreenMap";

export enum TileLayer {
	Background = "B",
	Interact = "I",
	Label = "L",
}

const B = TileLayer.Background;
const I = TileLayer.Interact;
// const transparentBlack = Jimp.rgbaToInt(0, 0, 0, 0);
const transparentWhite = Jimp.rgbaToInt(255, 255, 255, 0);

function rgb(red: number, green: number, blue: number): number {
	return Jimp.rgbaToInt(red, green, blue, 255);
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
	color: number;
	layer: TileLayer;
	name: string;
	toStyles?: () => Record<string, CSS.Properties>;
	toSvgElement?: (coordinate: Coordinate, renderer: TileRenderer) => JSX.Element;
	toSvgSymbols?: () => JSX.Element | JSX.Element[];
}

export interface TileSet {
	backgroundColor: number;
	name: string;
	poiBackgroundColor: string;
	poiBorderColor: string;
	poiColor: string;
	poiFont: string;
	tiles: Tile[];
}

// noinspection SpellCheckingInspection
export const FONT_SANS_DEFAULT = "Roboto, \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif";

export interface TileRenderer {
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

export const OldOnesIndoorDelve: TileSet = {
	poiBackgroundColor: "#ffff99",
	poiBorderColor: "#999933",
	poiColor: "#000000",
	poiFont: FONT_SANS_DEFAULT,
	backgroundColor: transparentWhite,
	name: "Old Ones Indoor Delve",
	tiles: [
		{name: "office floor", layer: B, color: rgb(128, 128, 128),},
		{name: "office door", layer: I, color: rgb(160, 160, 160),},
		{
			name: "office wall", layer: B, color: rgb(96, 96, 96),
			toSvgElement: (() => {
				const walls: Record<string, JSX.Element> = {
					"yes-nw": <rect class="wall-nw" x="0" y="0" width="0.1" height="0.1" fill="black" stroke="none"/>,
					"yes-n": <rect class="wall-n" x="0.1" y="0" width="0.8" height="0.1" fill="black" stroke="none"/>,
					"yes-ne": <rect class="wall-ne" x="0.9" y="0" width="0.1" height="0.1" fill="black" stroke="none"/>,
					"yes-e": <rect class="wall-e" x="0.9" y="0.1" width="0.1" height="0.8" fill="black" stroke="none"/>,
					"yes-se": <rect class="wall-se" x="0.9" y="0.9" width="0.1" height="0.1" fill="black" stroke="none"/>,
					"yes-s": <rect class="wall-s" x="0.1" y="0.9" width="0.8" height="0.1" fill="black" stroke="none"/>,
					"yes-sw": <rect class="wall-sw" x="0" y="0.9" width="0.1" height="0.1" fill="black" stroke="none"/>,
					"yes-w": <rect class="wall-w" x="0" y="0.1" width="0.1" height="0.8" fill="black" stroke="none"/>,
				};
				const grid = CARDINAL_POINTS.reduce((grid, dir) => {
					grid[dir] = {absent: {"office wall": `yes-${dir.toLowerCase()}`}};
					return grid;
				}, {} as NineGridReduce);
				return (coordinate: Coordinate, renderer: TileRenderer) =>
					<g transform={`translate(${coordinate.x} ${coordinate.y})`}>
						<title>Office Wall</title>
						<rect x="0" y="0" width="1" height="1" fill="#333333"/>
						{nineGridReduce(coordinate, renderer, grid).map(yes => walls[yes]).map(el => html(el)).join("\n")}
					</g>;
			})(),
		},
		{name: "railing", layer: B, color: rgb(192, 192, 192),},
		{name: "stairs", layer: I, color: rgb(208, 208, 208),},
		{name: "crate", layer: B, color: rgb(192, 192, 64),},
		{name: "rocks", layer: B, color: rgb(32, 128, 32),},
		{name: "puddle", layer: B, color: rgb(32, 32, 128),},
	],
};

export const TILE_SETS: TileSet[] = [
	OldOnesIndoorDelve,
];
