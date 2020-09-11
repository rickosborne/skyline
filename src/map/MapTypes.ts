import {JSX} from "preact";
import {BlockLayoutItem} from "../template/ScreenText";
import {NineGridCardinal, Tile, TileLayer, TileRenderer, TileSet} from "../template/TileSet";
import {Edge} from "./Edge";

export interface Coordinate {
	x: number;
	y: number;
}

export interface ScreenMapMetadata {
	scaleUnit: string;
	scaleValue: number;
	theme: string;
	title: string;
}

export interface ScreenMapEnvironmentItem {
	params?: Record<string, string>;
	rotate?: number,
	symbol: string;
	type: string;
}

export interface ScreenMapPointOfInterest {
	coordinates: Coordinate[];
	icon?: string;
	id: string;
	link?: string;
	overlay?: string;
	rotate?: number;
	story?: string;
	symbol?: string;
	tile?: string;
	title: string;
}

export enum ScreenMapRenderableType {
	Cell = "Cell",
	Shape = "Shape",
}

export function isCell(renderable: any): renderable is ScreenMapCell {
	return renderable != null && renderable.renderableType === ScreenMapRenderableType.Cell;
}

export function isShape(renderable: any): renderable is ScreenMapShape {
	return renderable != null && renderable.renderableType === ScreenMapRenderableType.Shape;
}

export interface ScreenMapRenderable {
	readonly layer: TileLayer;
	note?: string;
	readonly renderableType: ScreenMapRenderableType;
	tile?: Tile;
	toSvgElement?: (renderer: TileRenderer) => JSX.Element | undefined;
}

export interface ScreenMapCell extends ScreenMapRenderable {
	id: number;
	readonly coordinate: Coordinate;
	envItem?: ScreenMapEnvironmentItem;
	poi?: ScreenMapPointOfInterest;
	readonly renderableType: ScreenMapRenderableType.Cell;
	shape?: ScreenMapShape;
	readonly symbol: string;
}

export interface ScreenMapShape extends ScreenMapRenderable {
	readonly adjacencies: Map<number, NineGridCardinal[]>;
	readonly cells: ScreenMapCell[];
	readonly renderableType: ScreenMapRenderableType.Shape;
	readonly tile: Tile;
	edges: Edge[];
	outline: Coordinate[][];
	toSvgElement: (renderer: TileRenderer) => JSX.Element | undefined;
}

export type ScreenMapMetadataWriter = (meta: ScreenMapMetadata, item: BlockLayoutItem) => void;
export const METADATA_WRITERS: Record<string, ScreenMapMetadataWriter> = {
	title: (meta, item) => meta.title = item.value,
	theme: (meta, item) => meta.theme = item.value,
	scale: (meta, item) => {
		const match = item.value.match(/^\s*(\d+(?:[.]\d+)?)\s*(\w+)/i);
		if (match == null) {
			throw new Error(`Could not find Scale units in: ${item.value}`);
		}
		meta.scaleValue = parseFloat(match[1]);
		meta.scaleUnit = match[2];
	},
};
export const BACKGROUND_ID_SUFFIX = "--background";
export const POI_ID_SUFFIX = "--poi";

export interface CellGenerationContext {
	readonly envBySymbol: Record<string, ScreenMapEnvironmentItem>;
	readonly environment: ScreenMapEnvironmentItem[];
	readonly poiBySymbol: Record<string, ScreenMapPointOfInterest>;
	readonly tileSet: TileSet;
	readonly tilesByName: Record<string, Tile>;
}
