import * as console from "console";
import * as CSS from "csstype";
// @ts-ignore
import {h, JSX} from "preact";
import {Consumer, Type} from "../engine/type/Type";
import {html} from "./hypertext";
import {BlockLayoutItem, ScreenText} from "./ScreenText";
import {Tile, TILE_LAYERS, TileLayer, TileRenderer, TileSet} from "./TileSet";
import {TILE_SETS} from "./TileSets";
import {arrayify, renderCssRules, spinalCase} from "./util";
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

export interface ScreenMapCell {
	coordinate: Coordinate;
	envItem?: ScreenMapEnvironmentItem;
	layer: TileLayer;
	poi?: ScreenMapPointOfInterest;
	symbol: string;
	tile?: Tile;
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
	private readonly cells: ScreenMapCell[];
	private readonly envBySymbol: Record<string, ScreenMapEnvironmentItem>;
	private readonly poiBySymbol: Record<string, ScreenMapPointOfInterest>;
	private readonly tilesByName: Record<string, Tile>;

	protected constructor(
		public readonly metadata: ScreenMapMetadata,
		public readonly environment: ScreenMapEnvironmentItem[],
		public readonly points: ScreenMapPointOfInterest[],
		public readonly mapLines: string[],
		public readonly definition: string,
		public readonly tileSet: TileSet,
	) {
		this.tilesByName = tileSet.tiles.reduce((tiles, tile) => {
			tiles[tile.name] = tile;
			return tiles;
		}, {} as Record<string, Tile>);
		this.envBySymbol = this.environment.reduce((envItems, envItem) => {
			envItems[envItem.symbol] = envItem;
			return envItems;
		}, {} as Record<string, ScreenMapEnvironmentItem>);
		this.poiBySymbol = this.points.reduce((points, poi) => {
			points[poi.id] = poi;
			return points;
		}, {} as Record<string, ScreenMapPointOfInterest>);
		this.cells = this.mapLines.flatMap((line, y) => line.split("").flatMap((symbol, x): undefined | ScreenMapCell | ScreenMapCell[] => {
			return this.cellsFromSymbol(symbol, x, y);
		})).filter(Type.isNotNull) as ScreenMapCell[];
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
		const tileSet = TILE_SETS.find(ts => metadata.theme === ts.name);
		if (tileSet == null) {
			throw new Error(`No tileset named: ${metadata.theme}`);
		}
		return new ScreenMap(
			metadata,
			envItems.items,
			poiItems?.items || [],
			mapLines,
			text,
			tileSet,
		);
	}

	public cellsForLayer(layer: TileLayer): ScreenMapCell[] {
		return this.cells.filter(cell => cell.layer === layer);
	}

	private cellsFromEnv(envItem: ScreenMapEnvironmentItem, symbol: string, x: number, y: number, poiItem?: ScreenMapPointOfInterest): ScreenMapCell {
		const tile = this.tilesByName[envItem.type];
		if (tile == null) {
			throw new Error(`No tile named "${envItem.type}" for Environment symbol "${symbol}" at (${x}, ${y}).`);
		}
		const result: ScreenMapCell = {
			coordinate: {x, y},
			layer: tile?.layer || TileLayer.Background,
			envItem,
			tile,
			symbol,
		};
		if (poiItem != null) {
			result.poi = poiItem;
		}
		return result;
	}

	private cellsFromPoi(poi: ScreenMapPointOfInterest, symbol: string, x: number, y: number): ScreenMapCell[] {
		const results: ScreenMapCell[] = [];
		let envItem: ScreenMapEnvironmentItem | undefined;
		let tile: Tile | undefined;
		if (poi.symbol != null && poi.symbol !== symbol) {
			results.push(...this.cellsFromSymbol(poi.symbol, x, y));
			envItem = this.envBySymbol[poi.symbol];
			if (envItem != null) {
				tile = this.tilesByName[envItem.type];
			}
		}
		if (poi.tile != null) {
			envItem = envItem || this.environment.find(e => e.type === poi.tile);
			tile = tile || this.tilesByName[poi.tile];
		}
		if (poi.overlay != null) {
			const overlayTile = this.tilesByName[poi.overlay];
			if (overlayTile == null) {
				throw new Error(`No such overlay tile "${poi.overlay}" at "${poi.id}. ${poi.title}"`);
			}
			results.push(this.cellsFromTile(overlayTile, symbol, x, y, TileLayer.Overlay));
		}
		const result: ScreenMapCell = {
			coordinate: {x, y},
			layer: TileLayer.PointsOfInterest,
			poi,
			symbol,
		}
		if (envItem != null) {
			result.envItem = envItem;
		}
		if (tile != null) {
			result.tile = tile;
		}
		results.push(result);
		return results;
	}

	private cellsFromSymbol(symbol: string, x: number, y: number): ScreenMapCell[] {
		const results: ScreenMapCell[] = [];
		const poiItem = this.poiBySymbol[symbol];
		if (this.tileSet.isAmbient(symbol)) {
			return results;
		}
		if (poiItem != null) {
			results.push(...this.cellsFromPoi(poiItem, symbol, x, y));
		}
		const envItem = this.envBySymbol[symbol];
		if (envItem != null) {
			results.push(this.cellsFromEnv(envItem, symbol, x, y, poiItem));
		}
		return results;
	}

	// noinspection JSMethodCanBeStatic
	private cellsFromTile(tile: Tile, symbol: string, x: number, y: number, layer: TileLayer = TileLayer.Background): ScreenMapCell {
		return {
			coordinate: {x, y},
			layer,
			tile,
			symbol,
		};
	}

	public toDataUri(): Promise<string> {
		const jimp = this.toJimp();
		return jimp.getBase64Async(Jimp.MIME_PNG);
	}

	public toJimp(): any {
		const height = this.mapLines.length;
		const width = Math.max(...this.mapLines.map(l => l.length));
		const img = new Jimp(width, height);
		this.mapLines.forEach((line, y) => {
			for (let x = 0; x < width; x++) {
				const symbol = line.substr(x, 1);
				const envItem = this.envBySymbol[symbol];
				if (envItem == null) {
					img.setPixelColor(this.tileSet.backgroundColor, x, y);
				} else {
					const tile = this.tilesByName[envItem.type];
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
							<a class="poi-link" href={point.link}>{point.title}</a>}
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
		// const spinalName = spinalCase(tileSet.name) + "-";
		const showBackground = Jimp.intToRGBA(this.tileSet.backgroundColor).a != 0;
		const tileStyles = this.tileSet.tiles.flatMap(tile => tile.toStyles == null ? "" : Object
			.entries(tile.toStyles())
			.map(([selector, props]) => `${selector} {${Object
				.entries(props)
				.map(([key, value]) => `${key}: ${value};`)
				.join("\n")}}`)
			.join("\n"))
			.join("\n");
		const textAt = (coordinate: Coordinate, label: string, configurer?: Consumer<JSX.Element>) => {
			const el =
				<text x={coordinate.x - 0.025} y={coordinate.y + 0.05} fill={this.tileSet.poiColor} font-size="1px" text-anchor="middle" dominant-baseline="middle" class="poi">{label}</text>;
			if (configurer != null) {
				configurer(el);
			}
			return el;
		};
		const genericPoi = (coordinate: Coordinate, point: ScreenMapPointOfInterest) => {
			const title = <title>{point.title}</title>;
			const circle = <use href={`#${POI_ID_SUFFIX}`} x={coordinate.x + 0.5} y={coordinate.y + 0.5}/>;
			const label = textAt({x: coordinate.x + 0.5, y: coordinate.y + 0.5}, point.id);
			return point.link == null ? <g>
				{title}
				{circle}
				{label}
			</g> : <a href={point.link}>
				{title}
				{circle}
				{label}
			</a>;
		};
		const tileNameAt = (tx: number, ty: number) => {
			const tileLine = lines[ty];
			if (tileLine == null || tx < 0 || tx > (tileLine.length - 1)) {
				return undefined;
			}
			const sym = tileLine.charAt(tx);
			const e = this.envBySymbol[sym];
			return e == null ? undefined : e.type;
		};
		const renderer: TileRenderer = {
			genericPoi,
			textAt,
			tileNameAt,
		};
		const topLevelStyles: Record<string, CSS.PropertiesHyphen> = {
			".poi": {
				"font-family": this.tileSet.poiFont,
				"font-weight": "bold",
				"cursor": "default",
			}
		}
		const svg = html(
			<svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" data-xmlns-xlink="http://www.w3.org/1999/xlink">
				<style>
					{renderCssRules(topLevelStyles)}
					{this.tileSet.tiles.map(tile => tile.toStyles == null ? undefined : renderCssRules(tile.toStyles())).filter(Type.isNotNull).join("\n")}
				</style>
				<defs>
					{this.tileSet.tiles.map(tile => tile.toSvgSymbols == null ? html(
						<rect width={1} height={1} fill={tile.color} stroke="none" rx="0.1" ry="0.1" id={spinalCase(tile.name)}>
							<title>{tile.name}</title>
						</rect>
					) : arrayify(tile.toSvgSymbols()).map(el => html(el)).join("\n")).join("\n")}
					<rect width={1} height={1} fill="transparent" id={BACKGROUND_ID_SUFFIX}/>
					<circle r={0.7} id={POI_ID_SUFFIX} stroke-width={0.07} stroke={this.tileSet.poiBorderColor} fill={this.tileSet.poiBackgroundColor}/>
				</defs>
				{TILE_LAYERS.map(layer => {
					const cells = this.cellsForLayer(layer);
					if (cells.length === 0) {
						return <g class="empty-layer"/>;
					}
					const renderedCells = cells.flatMap(cell => {
						const els: JSX.Element[] = [];
						if (cell.tile != null) {
							if (cell.tile.toSvgElement != null) {
								els.push(cell.tile.toSvgElement(cell.coordinate, renderer, cell.envItem));
							} else {
								els.push(<use href={`#${spinalCase(cell.tile.name)}`} x={cell.coordinate.x} y={cell.coordinate.y}/>);
							}
						} else if (showBackground) {
							els.push(<use href={`#${BACKGROUND_ID_SUFFIX}`} x={cell.coordinate.x} y={cell.coordinate.y}/>);
						}
						if (cell.poi != null) {
							if (this.tileSet.svgElementFromPoint != null) {
								els.push(this.tileSet.svgElementFromPoint(cell.coordinate, renderer, cell.poi, cell.envItem, cell.tile));
							} else {
								els.push(genericPoi(cell.coordinate, cell.poi));
							}
						}
						return els;
					}).filter(Type.isNotNull);
					return <g class={`layer-${layer}`}>{renderedCells.map(cell => html(cell)).join("\n")}</g>;
				}).filter(Type.isNotNull).map(layer => html(layer)).join("\n")}
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
