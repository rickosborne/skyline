import * as CSS from "csstype";
import * as Jimp from "jimp";
import {h, JSX} from "preact";
import {lpad} from "../engine/EngineConfig";
import {Consumer, Type} from "../engine/type/Type";
import {html} from "./hypertext";
import {Coordinate, ScreenMapEnvironmentItem, ScreenMapPointOfInterest} from "./ScreenMap";

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

export const OldOnesIndoorDelve: TileSet = {
	poiBackgroundColor: "#ffff99",
	poiBorderColor: "#999933",
	poiColor: "#000000",
	poiFont: FONT_SANS_DEFAULT,
	backgroundColor: transparentWhite,
	name: "Old Ones Indoor Delve",
	svgElementFromPoint: (coordinate, renderer, point, envItem, tile) => {
		//  transform={`translate(${coordinate.x} ${coordinate.y} scale(2)`}
		if (point.overlay === "crate") {
			return <g>
				<use href="#office-crate" x={coordinate.x - 0.5} y={coordinate.y - 0.5} width="2" height="2"/>
				{renderer.textAt({x: coordinate.x + 0.5, y: coordinate.y + 0.5}, point.id)}
			</g>;
		} else {
			return renderer.genericPoi(coordinate, point);
		}
	},
	tiles: [
		{name: "office floor", layer: B, color: rgb(128, 128, 128),},
		{name: "office door", layer: I, color: rgb(160, 160, 160),},
		{
			name: "office wall", layer: B, color: rgb(96, 96, 96),
			toSvgSymbols: () => [
				// <path id="office-wall-n" d="M0,0 h1 L0.9,0.1 h-0.8 v0.8 L0,1 z" fill="black" stroke="none" />,
				<rect id="office-wall-h" width="1" height="0.1" fill="black" stroke="none"/>,
				<rect id="office-wall-v" width="0.1" height="1" fill="black" stroke="none"/>,
				<rect id="office-wall-c" width="0.1" height="0.1" fill="black" stroke="none"/>,
				<rect id="office-wall-b" x="0" y="0" width="1" height="1" fill="#333333"/>,
			],
			toSvgElement: (() => {
				const walls: Record<string, JSX.Element> = {
					"yes-n": <use href="#office-wall-h" x="0" y="0"/>,
					"yes-e": <use href="#office-wall-v" x="0.9" y="0"/>,
					"yes-s": <use href="#office-wall-h" x="0" y="0.9"/>,
					"yes-w": <use href="#office-wall-v" x="0" y="0"/>,
					"chip-ne": <use href="#office-wall-c" x="0.9" y="0"/>,
					"chip-nw": <use href="#office-wall-c" x="0" y="0"/>,
					"chip-se": <use href="#office-wall-c" x="0.9" y="0.9"/>,
					"chip-sw": <use href="#office-wall-c" x="0" y="0.9"/>,
				};
				const grid = CARDINAL_POINTS.reduce((grid, dir) => {
					grid[dir] = {
						absent: {"office wall": `yes-${dir.toLowerCase()}`}
					};
					return grid;
				}, {} as NineGridReduce);
				return (coordinate: Coordinate, renderer: TileRenderer) => {
					const wallNames = nineGridReduce(coordinate, renderer, grid);
					DIAGONAL_POINTS_LOWER_HV.forEach(hv => {
						if (!wallNames.includes(`yes-${hv.h}`) && !wallNames.includes(`yes-${hv.v}`) && wallNames.includes(`yes-${hv.c}`)) {
							wallNames.push(`chip-${hv.c}`);
						}
					});
					return <g transform={`translate(${coordinate.x} ${coordinate.y})`}>
						<title>Wall</title>
						<use href="#office-wall-b" x="0" y="0"/>
						{wallNames.map(yes => walls[yes]).filter(Type.isNotNull).map(el => html(el)).join("\n")}
					</g>;
				}
			})(),
		},
		{name: "railing", layer: B, color: rgb(192, 192, 192),},
		{
			name: "stairs", layer: I, color: rgb(208, 208, 208),
			toSvgSymbols: () => [
				<symbol id="office-stairs" viewBox="0 0 1 1">
					<title>Stairs</title>
					<rect x="0" y="0" width="0.2" height="1" fill="#999999" stroke="none"/>
					<rect x="0.2" y="0" width="0.2" height="1" fill="#aaaaaa" stroke="none"/>
					<rect x="0.4" y="0" width="0.2" height="1" fill="#bbbbbb" stroke="none"/>
					<rect x="0.6" y="0" width="0.2" height="1" fill="#cccccc" stroke="none"/>
					<rect x="0.8" y="0" width="0.2" height="1" fill="#dddddd" stroke="none"/>
				</symbol>
			],
			toSvgElement: (coordinate: Coordinate, renderer, envItem) => {
				let el = <use href="#office-stairs" x={coordinate.x} y={coordinate.y} width="1" height="1"/>;
				if (envItem != null && envItem.rotate != null) {
					el.props.transform = `rotate(${envItem.rotate}, ${coordinate.x + 0.5}, ${coordinate.y + 0.5})`;
				}
				return el;
			},
		},
		{
			name: "crate", layer: B, color: rgb(192, 192, 64),
			toSvgSymbols: () => [
				<symbol id="office-crate" viewBox="0 0 1 1" width="1" height="1">
					<title>Crate</title>
					<path d="M0.05,0.5 l0.45,-0.45 l0.45,0.45 l-0.45,0.45 z" fill="none" stroke="#ccffff" stroke-width="0.05"/>
					<path d="M0.15,0.5 l0.35,-0.35 l0.35,0.35 l-0.35,0.35 z" fill="#ccffff" stroke="none"/>
				</symbol>
			],
		},
		{name: "rocks", layer: B, color: rgb(32, 128, 32),},
		{name: "puddle", layer: B, color: rgb(32, 32, 128),},
	],
};

export const TILE_SETS: TileSet[] = [
	OldOnesIndoorDelve,
];
