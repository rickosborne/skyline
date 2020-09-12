import {hexFromRGB} from "../template/TileSet";

export interface RGBColor {
	b: number;
	g: number;
	r: number;
}

export interface RGBAColor extends RGBColor {
	a: number;
}

export function isRGBA(color: RGBColor): color is RGBAColor {
	return typeof (color as RGBAColor).a === "number";
}

export function rgbFromHex(hexColor: string): RGBColor {
	const hex = hexColor.startsWith("#") ? hexColor.substr(1) : hexColor;
	if (hex.length === 3) {
		return {r: parseInt(hex[0].repeat(2), 16), g: parseInt(hex[1].repeat(2), 16), b: parseInt(hex[2].repeat(2), 16)};
	} else if (hex.length === 4) {
		return {
			r: parseInt(hex[0].repeat(2), 16),
			g: parseInt(hex[1].repeat(2), 16),
			b: parseInt(hex[2].repeat(2), 16),
			a: parseInt(hex[3].repeat(2), 16)
		} as RGBAColor;
	} else if (hex.length === 6) {
		return {r: parseInt(hex.substr(0, 2), 16), g: parseInt(hex.substr(2, 2), 16), b: parseInt(hex.substr(4, 2), 16)};
	} else if (hex.length === 8) {
		return {
			r: parseInt(hex.substr(0, 2), 16),
			g: parseInt(hex.substr(2, 2), 16),
			b: parseInt(hex.substr(4, 2), 16),
			a: parseInt(hex.substr(6, 2), 16)
		} as RGBAColor;
	}
	throw new Error(`Not a hex color: ${hexColor}`);
}

export function hexFromRGBColor(color: RGBColor): string {
	return hexFromRGB(color.r, color.g, color.b, isRGBA(color) ? color.a : undefined);
}

export function rgb(r: number, g: number, b: number): RGBColor {
	return {r, g, b};
}

export function averageColor(...colors: RGBColor[]): RGBColor {
	let rs: number = 0;
	let gs: number = 0;
	let bs: number = 0;
	for (let color of colors) {
		rs += color.r;
		gs += color.g;
		bs += color.b;
	}
	return {
		r: Math.round(rs / colors.length),
		g: Math.round(gs / colors.length),
		b: Math.round(bs / colors.length),
	}
}

export function mean(nums: number[]): number {
	return sum(nums) / nums.length;
}

export function sum(nums: number[]): number {
	return nums.reduce((p, c) => p + c, 0);
}
