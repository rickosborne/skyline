import * as console from "console";
// @ts-ignore
import {h} from "preact";
import {Type} from "../engine/type/Type";
import {html} from "./hypertext";
import {BlockLayoutItem, ScreenText} from "./ScreenText";
import {hexFromNum, Tile, TileSet, TILE_SETS} from "./TileSet";
import {spinalCase} from "./util";
// @ts-ignore
const Jimp = require('potrace/node_modules/jimp');

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

const BACKGROUND_ID_SUFFIX = "--background";

const POI_ID_SUFFIX = "--poi";

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
		const ts = TILE_SETS.find(ts => this.metadata.theme === ts.name);
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
					coordinates: [],
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
		const poiById = (poiItems?.items || []).reduce((map, poi) => {
			map.set(poi.id, poi);
			return map;
		}, new Map<string, ScreenMapPointOfInterest>())
		mapLines.forEach((line, y) => {
			line.split("").forEach((symbol, x) => {
				const poi = poiById.get(symbol);
				if (poi != null) {
					poi.coordinates.push({x, y});
				}
			});
		});
		return new ScreenMap(
			metadata,
			envItems.items,
			poiItems?.items || [],
			mapLines,
			text
		);
	}

	protected getTilesAndEnvItemsBySymbol(): [TileSet, Record<string, Tile>, Record<string, ScreenMapEnvironmentItem>] {
		const tileSet = this.tileSet;
		const tiles = tileSet.tiles.reduce((tiles, tile) => {
			tiles[tile.name] = tile;
			return tiles;
		}, {} as Record<string, Tile>);
		const envItemsBySymbol = this.environment.reduce((envItems, envItem) => {
			envItems[envItem.symbol] = envItem;
			return envItems;
		}, {} as Record<string, ScreenMapEnvironmentItem>);
		return [tileSet, tiles, envItemsBySymbol];
	}

	public toDataUri(): Promise<string> {
		const jimp = this.toJimp();
		return jimp.getBase64Async(Jimp.MIME_PNG);
	}

	public toJimp(): any {
		const height = this.mapLines.length;
		const width = Math.max(...this.mapLines.map(l => l.length));
		const [tileSet, tiles, envItemsBySymbol] = this.getTilesAndEnvItemsBySymbol();
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

	public toSvg(): string {
		const lines = this.mapLines; // scale3xText(this.mapLines);
		const height = lines.length;
		const width = Math.max(...lines.map(l => l.length));
		const [tileSet, tiles, envItemsBySymbol] = this.getTilesAndEnvItemsBySymbol();
		const spinalName = spinalCase(tileSet.name) + "-";
		const showBackground = Jimp.intToRGBA(tileSet.backgroundColor).a != 0;
		return html(
			<svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" data-xmlns-xlink="http://www.w3.org/1999/xlink">
				<style>
					.poi {"{"}
					font-family: {tileSet.poiFont};
					font-weight: bold;
					{"}"}
				</style>
				<defs>
					{tileSet.tiles.map(tile => html(
						<rect width={1} height={1} fill={hexFromNum(tile.color)} stroke="none" rx="0.1" ry="0.1" id={spinalName + spinalCase(tile.name)} title={tile.name}>
							<title>{tile.name}</title>
						</rect>
					)).join("\n")}
					<rect width={1} height={1} fill="transparent" id={spinalName + BACKGROUND_ID_SUFFIX}/>
					<circle r={0.7} id={spinalName + POI_ID_SUFFIX} stroke-width={0.07} stroke={tileSet.poiBorderColor} fill={tileSet.poiBackgroundColor}/>
				</defs>
				<g title="Tiles">
					{lines.flatMap((line, y) => {
						const rects: string[] = [];
						for (let x = 0; x < width; x++) {
							const symbol = line.substr(x, 1);
							const envItem = envItemsBySymbol[symbol];
							let bgColor = tileSet.backgroundColor;
							if (envItem != null) {
								const tile = tiles[envItem.type];
								if (tile == null) {
									throw new Error(`No tile for environment item: ${JSON.stringify(envItem)}`);
								}
								bgColor = tile.color;
								rects.push(html(
									<use data-xlink-href={`#${spinalName + spinalCase(tile.name)}`} x={x} y={y} data-data-symbol={symbol}/>
								));
							} else if (showBackground) {
								rects.push(html(
									<use data-xlink-href={`#${spinalName + BACKGROUND_ID_SUFFIX}`} x={x} y={y}/>
								));
							}
						}
						return rects;
					}).join("\n")}
				</g>
				<g title="Points of Interest">
					{this.points.map(point => {
						let coordinate: Coordinate;
						if (point.coordinates.length === 0) {
							throw new Error(`No coordinated for POI: ${JSON.stringify(point)}`);
						} else {
							coordinate = point.coordinates[0];
						}
						const x = coordinate.x + 0.5;
						const y = coordinate.y + 0.5;
						return html(
							<g>
								<title>{point.title}</title>
								<use data-xlink-href={`#${spinalName + POI_ID_SUFFIX}`} x={x} y={y}/>
								<text x={x} y={y} fill={tileSet.poiColor} font-size="1px" text-anchor="middle" dominant-baseline="middle" dx="-0.025" dy="0.05" class="poi">{point.id}</text>
							</g>
						);
					}).filter(Type.isNotNull).join("\n")}
				</g>
			</svg>
		);
	}
}
