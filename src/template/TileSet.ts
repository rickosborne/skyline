import * as Jimp from "jimp";
import {lpad} from "../engine/EngineConfig";

export enum TileLayer {
	Background = "B",
	Interact = "I",
	Label = "L",
}

const B = TileLayer.Background;
const I = TileLayer.Interact;
// const transparentBlack = Jimp.rgbaToInt(0, 0, 0, 0);
const transparentWhite = Jimp.rgbaToInt(255, 255, 255, 0);

function rgb(red: number, blue: number, green: number): number {
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
		{name: "office wall", layer: B, color: rgb(96, 96, 96),},
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
