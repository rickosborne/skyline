import * as console from "console";
// @ts-ignore
import {h, JSX} from "preact";
import {Consumer, Type} from "../engine/type/Type";
import {html} from "./hypertext";
import {BlockLayoutItem, ScreenText} from "./ScreenText";
import {hexFromNum, Tile, TILE_SETS, TileRenderer, TileSet} from "./TileSet";
import {arrayify, renderCssRules, spinalCase} from "./util";
// @ts-ignore
const Jimp = require('potrace/node_modules/jimp');
import * as CSS from "csstype";

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
					if (item.params.rotate !== "string") {
						env.rotate = parseFloat(item.params.rotate);
					}
					// env.params = item.params;
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
					(["icon", "link", "overlay", "story", "symbol", "tile"] as (string & keyof ScreenMapPointOfInterest)[])
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

	protected getTilesAndEnvItemsBySymbol(): [TileSet, Record<string, Tile>, Record<string, ScreenMapEnvironmentItem>, Record<string, ScreenMapPointOfInterest>] {
		const tileSet = this.tileSet;
		const tiles = tileSet.tiles.reduce((tiles, tile) => {
			tiles[tile.name] = tile;
			return tiles;
		}, {} as Record<string, Tile>);
		const envItemsBySymbol = this.environment.reduce((envItems, envItem) => {
			envItems[envItem.symbol] = envItem;
			return envItems;
		}, {} as Record<string, ScreenMapEnvironmentItem>);
		const poiBySymbol = this.points.reduce((points, poi) => {
			points[poi.id] = poi;
			return points;
		}, {} as Record<string, ScreenMapPointOfInterest>);
		return [tileSet, tiles, envItemsBySymbol, poiBySymbol];
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

	public toPoiTable(): JSX.Element | undefined {
		if (this.points.length === 0) {
			return undefined;
		}
		return <figcaption class="points-of-interest avoid-break-before">
			<header>Points of Interest</header>
			<dl>
				{this.points.map(point => <div class="detailed">
					<dt class="poi-id">{point.id}</dt>
					<dd class="poi-title">
						{point.link == null ? <span class="poi-title">{point.title}</span> :
							<a class="poi-link" data-old-href={`${point.link} | relative_url`} href="#">{point.title}: {point.link}</a>}
					</dd>
				</div>)}
			</dl>
		</figcaption>
			;
	}

	public toSvg(): string {
		const lines = this.mapLines; // scale3xText(this.mapLines);
		const height = lines.length;
		const width = Math.max(...lines.map(l => l.length));
		const [tileSet, tiles, envItemsBySymbol, poiBySymbol] = this.getTilesAndEnvItemsBySymbol();
		// const spinalName = spinalCase(tileSet.name) + "-";
		const showBackground = Jimp.intToRGBA(tileSet.backgroundColor).a != 0;
		const tileStyles = tileSet.tiles.flatMap(tile => tile.toStyles == null ? "" : Object
			.entries(tile.toStyles())
			.map(([selector, props]) => `${selector} {${Object
				.entries(props)
				.map(([key, value]) => `${key}: ${value};`)
				.join("\n")}}`)
			.join("\n"))
			.join("\n");
		const textAt = (coordinate: Coordinate, label: string, configurer?: Consumer<JSX.Element>) => {
			const el =
				<text x={coordinate.x - 0.025} y={coordinate.y + 0.05} fill={tileSet.poiColor} font-size="1px" text-anchor="middle" dominant-baseline="middle" class="poi">{label}</text>;
			if (configurer != null) {
				configurer(el);
			}
			return el;
		};
		const genericPoi = (coordinate: Coordinate, point: ScreenMapPointOfInterest) => <g>
			<title>{point.title}</title>
			<use href={`#${POI_ID_SUFFIX}`} x={coordinate.x} y={coordinate.y}/>
			{textAt(coordinate, point.id)}
		</g>;
		const tileNameAt = (tx: number, ty: number) => {
			const tileLine = lines[ty];
			if (tileLine == null || tx < 0 || tx > (tileLine.length - 1)) {
				return undefined;
			}
			const sym = tileLine.charAt(tx);
			const e = envItemsBySymbol[sym];
			return e == null ? undefined : e.type;
		};
		const renderer: TileRenderer = {
			genericPoi,
			textAt,
			tileNameAt,
		};
		const topLevelStyles: Record<string, CSS.PropertiesHyphen> = {
			".poi": {
				"font-family": tileSet.poiFont,
				"font-weight": "bold",
				"cursor": "default",
			}
		}
		const svg = html(
			<svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
				<style>
					{renderCssRules(topLevelStyles)}
					{tileSet.tiles.map(tile => tile.toStyles == null ? undefined : renderCssRules(tile.toStyles())).filter(Type.isNotNull).join("\n")}
				</style>
				<defs>
					{tileSet.tiles.map(tile => tile.toSvgSymbols == null ? html(
						<rect width={1} height={1} fill={hexFromNum(tile.color)} stroke="none" rx="0.1" ry="0.1" id={spinalCase(tile.name)}>
							<title>{tile.name}</title>
						</rect>
					) : arrayify(tile.toSvgSymbols()).map(el => html(el)).join("\n")).join("\n")}
					<rect width={1} height={1} fill="transparent" id={BACKGROUND_ID_SUFFIX}/>
					<circle r={0.7} id={POI_ID_SUFFIX} stroke-width={0.07} stroke={tileSet.poiBorderColor} fill={tileSet.poiBackgroundColor}/>
				</defs>
				<g>
					{lines.flatMap((line, y) => {
						const rects: JSX.Element[] = [];
						for (let x = 0; x < width; x++) {
							let symbol = line.substr(x, 1);
							const poiItem = poiBySymbol[symbol];
							let envItem: ScreenMapEnvironmentItem | undefined;
							let bgColor = tileSet.backgroundColor;
							let tile: Tile | undefined;
							if (poiItem != null) {
								if (poiItem.symbol != null) {
									symbol = poiItem.symbol;
								} else if (poiItem.tile != null) {
									envItem = this.environment.find(e => e.type === poiItem.tile);
									tile = tiles[poiItem.tile];
								}
							}
							if (envItem == null && symbol != null) {
								envItem = envItemsBySymbol[symbol];
							}
							if (envItem != null && tile == null) {
								tile = tiles[envItem.type];
							}
							if (tile == null && envItem != null) {
								throw new Error(`No tile for environment item: ${JSON.stringify(envItem)}`);
							}
							if (tile != null) {
								bgColor = tile.color;
								if (tile.toSvgElement != null) {
									rects.push(tile.toSvgElement({x, y}, renderer, envItem));
								} else {
									rects.push(<use href={`#${spinalCase(tile.name)}`} x={x} y={y}/>);
								}
							} else if (showBackground) {
								rects.push(<use href={`#${BACKGROUND_ID_SUFFIX}`} x={x} y={y}/>);
							}
						}
						return rects;
					})}
				</g>
				<g>
					{this.points.map(point => {
						let coordinate: Coordinate;
						if (point.coordinates.length === 0) {
							throw new Error(`No coordinated for POI: ${JSON.stringify(point)}`);
						} else {
							coordinate = point.coordinates[0];
						}
						let envItem = point.symbol == null ? undefined : this.environment.find(e => e.symbol === point.symbol);
						let tile = point.tile != null ? tiles[point.tile] : envItem != null ? tiles[envItem.type] : undefined;
						const x = coordinate.x + 0.5;
						const y = coordinate.y + 0.5;
						const el = tileSet.svgElementFromPoint == null ? renderer.genericPoi({
							x,
							y
						}, point) : tileSet.svgElementFromPoint(coordinate, renderer, point, envItem, tile);
						return html(el);
					}).filter(Type.isNotNull).join("\n")}
				</g>
			</svg>
		);
		return html(
			<figure>
				{svg}
				{this.toPoiTable()}
			</figure>
		);
	}
}
