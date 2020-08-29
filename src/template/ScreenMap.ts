import * as console from "console";
// @ts-ignore
const Jimp = require('potrace/node_modules/jimp');
// @ts-ignore
import * as potrace from 'potrace';
import {BlockLayoutItem, ScreenText} from "./ScreenText";
import {Tile, TileSet, TILESETS} from "./TileSet";

export interface ScreenMapMetadata {
	scaleUnit: string;
	scaleValue: number;
	theme: string;
	title: string;
}

export interface ScreenMapEnvironmentItem {
	params?: Record<string, string>;
	symbol: string;
	type: string;
}

export interface ScreenMapPointOfInterest {
	icon?: string;
	id: string;
	link?: string;
	overlay?: string;
	rotate?: number;
	story?: string;
	tile?: string;
	title: string;
}

export type ScreenMapMetadataWriter = (meta: ScreenMapMetadata, item: BlockLayoutItem) => void;
const METADATA_WRITERS: Record<string, ScreenMapMetadataWriter> = {
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

export class ScreenMap {
	protected constructor(
		public readonly metadata: ScreenMapMetadata,
		public readonly environment: ScreenMapEnvironmentItem[],
		public readonly points: ScreenMapPointOfInterest[],
		public readonly mapLines: string[],
		public readonly definition: string,
	) {
	}

	public get tileSet(): TileSet {
		const ts = TILESETS.find(ts => this.metadata.theme === ts.name);
		if (ts == null) {
			throw new Error(`No tileset named: ${this.metadata.theme}`);
		}
		return ts;
	}

	public static from(text: string): ScreenMap | undefined {
		const screen = ScreenText.from(text);
		const mapItems = screen.getBlockItems({header: "Map", keyValueDelimiter: ":"});
		if (mapItems == null) {
			return undefined;
		}
		const metadata = mapItems.items.reduce((meta, item) => {
			const writer = METADATA_WRITERS[item.key.toLowerCase()];
			if (writer == null) {
				throw new Error(`Unknown metadata key: ${JSON.stringify(item)}`);
			}
			writer(meta, item);
			return meta;
		}, {} as ScreenMapMetadata);
		const envItems = screen.getBlockItems<ScreenMapEnvironmentItem>({
			header: "Environment",
			itemBuilder: item => {
				const env: ScreenMapEnvironmentItem = {
					symbol: item.key,
					type: item.value,
				};
				if (item.params != null) {
					env.params = item.params;
				}
				return env;
			},
		});
		if (envItems == null) {
			console.warn("Map was found, but no Environment.");
			return undefined;
		}
		const poiItems = screen.getBlockItems<ScreenMapPointOfInterest>({
			header: "Points of Interest",
			itemBuilder: item => {
				const poi: ScreenMapPointOfInterest = {
					title: item.value,
					id: item.key,
				};
				if (item.params != null) {
					if (item.params.rotate != null) {
						poi.rotate = parseFloat(item.params.rotate);
					}
					(["icon", "link", "overlay", "story", "tile"] as (string & keyof ScreenMapPointOfInterest)[])
						.filter(key => item.params?.[key] != null)
						.forEach(key => (poi[key] as any) = item.params?.[key]);
				}
				return poi;
			},
			keyValueDelimiter: "."
		});
		if (poiItems == null) {
			if (text.toLowerCase().includes("points of interest")) {
				throw new Error("Check your case for 'Points of Interest'");
			}
			console.warn("No POI found in map.");
		}
		const mapLines = screen
			.withBlank(mapItems.bounds)
			.withBlank(envItems.bounds)
			.withBlank(poiItems?.bounds)
			.trimmed();
		return new ScreenMap(
			metadata,
			envItems.items,
			poiItems?.items || [],
			mapLines,
			text
		);
	}

	public toJimp(): any {
		const height = this.mapLines.length;
		const width = Math.max(...this.mapLines.map(l => l.length));
		const tileSet = this.tileSet;
		const tiles = tileSet.tiles.reduce((tiles, tile) => {
			tiles[tile.name] = tile;
			return tiles;
		}, {} as Record<string, Tile>);
		const envItemsBySymbol = this.environment.reduce((envItems, envItem) => {
			envItems[envItem.symbol] = envItem;
			return envItems;
		}, {} as Record<string, ScreenMapEnvironmentItem>);
		const img = new Jimp(width, height);
		this.mapLines.forEach((line, y) => {
			for (let x = 0; x < width; x++) {
				const symbol = line.substr(x, 1);
				const envItem = envItemsBySymbol[symbol];
				if (envItem == null) {
					img.setPixelColor(tileSet.backgroundColor, x, y);
				} else {
					const tile = tiles[envItem.type];
					if (tile == null) {
						throw new Error(`No tile for environment item: ${JSON.stringify(envItem)}`);
					}
					img.setPixelColor(tile.color, x, y);
				}
			}
		});
		return img;
	}

	public toDataUri(): Promise<string> {
		const jimp = this.toJimp();
		return jimp.getBase64Async(Jimp.MIME_PNG);
	}

	public toSvg(): string {
		const jimp = this.toJimp();
		const trace = new potrace.Potrace();
		const svgHolder: string[] = [];
		trace.loadImage(jimp, (err: Error | null) => {
			if (err) throw err;
			const svg = trace.getSVG();
			svgHolder.push(svg);
		});
		return svgHolder[0];
	}
}
