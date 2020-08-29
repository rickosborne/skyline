import * as Jimp from "jimp";

export enum TileLayer {
	Background = "B",
	Interact = "I",
	Label = "L",
}

const B = TileLayer.Background;
const I = TileLayer.Interact;
const transparentBlack = Jimp.rgbaToInt(0, 0, 0, 0);
const transparentWhite = Jimp.rgbaToInt(255, 255, 255, 0);

function rgb(red: number, blue: number, green: number): number {
	return Jimp.rgbaToInt(red, green, blue, 255);
}

export interface Tile {
	color: number;
	layer: TileLayer;
	name: string;
}

export interface TileSet {
	backgroundColor: number;
	name: string;
	tiles: Tile[];
}

export const OldOnesIndoorDelve: TileSet = {
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

export const TILESETS: TileSet[] = [
	OldOnesIndoorDelve,
];
