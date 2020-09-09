import * as console from "console";
import * as CSS from "csstype";
import {h, JSX} from "preact";
import {Consumer, Type} from "../engine/type/Type";
import {cellsFromMapLines} from "../map/cellsFromMapLines";
import {
	BACKGROUND_ID_SUFFIX,
	CellGenerationContext,
	Coordinate,
	isCell,
	isShape,
	METADATA_WRITERS,
	POI_ID_SUFFIX,
	ScreenMapCell,
	ScreenMapEnvironmentItem,
	ScreenMapMetadata,
	ScreenMapPointOfInterest,
	ScreenMapRenderable
} from "../map/MapTypes";
import {html} from "./hypertext";
import {BlockLayoutBounds, ScreenText} from "./ScreenText";
import {Tile, TILE_LAYERS, TileLayer, TileRenderer, TileSet} from "./TileSet";
import {TILE_SETS} from "./TileSets";
import {arrayify, renderCssRules, spinalCase} from "./util";


export class ScreenMap implements CellGenerationContext {
	public readonly cells: ScreenMapCell[];
	public readonly envBySymbol: Record<string, ScreenMapEnvironmentItem>;
	public readonly height: number;
	public readonly poiBySymbol: Record<string, ScreenMapPointOfInterest>;
	public readonly renderables: ScreenMapRenderable[];
	public readonly renderer: TileRenderer = {
		genericTile: this.genericTile.bind(this),
		genericPoi: this.genericPoi.bind(this),
		textAt: this.textAt.bind(this),
		tileNameAt: this.tileNameAt.bind(this),
	}
	public readonly spinalName: string;
	public readonly tilesByName: Record<string, Tile>;
	public readonly topLevelStyles: Record<string, CSS.PropertiesHyphen> = {
		".poi": {
			"font-family": this.tileSet.poiFont,
			"font-weight": "bold",
			"cursor": "default",
		}
	}
	public readonly width: number;
	public readonly bounds: BlockLayoutBounds;

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
		this.cells = cellsFromMapLines(this.mapLines, this);
		this.height = this.mapLines.length;
		this.width = Math.max(...this.mapLines.map(line => line.length));
		this.bounds = {
			top: 0,
			left: 0,
			right: this.width,
			bottom: this.height,
		};
		this.renderables = this.tileSet.renderablesFromCells == null ? this.cells : this.tileSet.renderablesFromCells(this.cells, this.renderer, this.bounds);
		this.spinalName = spinalCase(tileSet.name);
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

	public cellsAt(x: number, y: number): ScreenMapCell[] {
		return this.cells.filter(cell => cell.coordinate.x === x && cell.coordinate.y === y);
	}

	public cellsAtLayer(x: number, y: number, layer: TileLayer): ScreenMapCell[] {
		return this.cellsAt(x, y).filter(cell => cell.layer === layer);
	}

	public cellsForLayer(layer: TileLayer): ScreenMapCell[] {
		return this.cells.filter(cell => cell.layer === layer);
	}

	public genericPoi(coordinate: Coordinate, point: ScreenMapPointOfInterest): JSX.Element {
		const title = <title>{point.title}</title>;
		const circle = <use href={`#${POI_ID_SUFFIX}`} x={coordinate.x + 0.5} y={coordinate.y + 0.5} class="poi-generic"/>;
		const label = this.textAt({x: coordinate.x + 0.5, y: coordinate.y + 0.5}, point.id);
		return point.link == null ? <g class="poi-generic-group">
			{title}
			{circle}
			{label}
		</g> : <a href={point.link} class="poi-generic-link">
			{title}
			{circle}
			{label}
		</a>;
	}

	public genericTile(cell: ScreenMapCell, tile: Tile | undefined = cell.tile): JSX.Element {
		return <use href={`#${spinalCase(tile?.name || "")}`} x={cell.coordinate.x} y={cell.coordinate.y} class="generic-tile"/>;
	}

	public renderablesForLayer(layer: TileLayer): ScreenMapRenderable[] {
		return this.renderables.filter(r => r.layer === layer);
	}

	public textAt(coordinate: Coordinate, label: string, configurer?: Consumer<JSX.Element>): JSX.Element {
		const el =
			<text x={coordinate.x - 0.025} y={coordinate.y + 0.05} fill={this.tileSet.poiColor} font-size="1px" text-anchor="middle" dominant-baseline="middle" class="poi">{label}</text>;
		if (configurer != null) {
			configurer(el);
		}
		return el;
	}

	public tileNameAt(tx: number, ty: number) {
		const tileLine = this.mapLines[ty];
		if (tileLine == null || tx < 0 || tx > (tileLine.length - 1)) {
			return undefined;
		}
		const sym = tileLine.charAt(tx);
		const e = this.envBySymbol[sym];
		return e == null ? undefined : e.type;
	}

	public toDataUri(): Promise<string> {
		throw new Error(`Not implemented: ${this.constructor.name}.toDataUri`);
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
		const svg = html(
			<svg viewBox={`0 0 ${this.width} ${this.height}`} xmlns="http://www.w3.org/2000/svg" data-xmlns-xlink="http://www.w3.org/1999/xlink">
				<style>
					{renderCssRules(this.topLevelStyles)}
					{this.tileSet.tiles.map(tile => tile.styles == null ? undefined : renderCssRules(tile.styles)).filter(Type.isNotNull).join("\n")}
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
					const renderables = this.renderablesForLayer(layer);
					if (renderables.length === 0) {
						return undefined;
					}
					const renderedCells = renderables.flatMap(renderable => {
						const els: JSX.Element[] = [];
						if (isShape(renderable)) {
							els.push(renderable.toSvgElement(this.renderer));
						} else if (isCell(renderable)) {
							if (renderable.tile != null) {
								if (renderable.tile.toSvgElement != null) {
									els.push(renderable.tile.toSvgElement(renderable.coordinate, this.renderer, renderable.envItem));
								} else {
									els.push(this.genericTile(renderable));
								}
							} else if (this.tileSet.backgroundColor != null) {
								els.push(
									<use href={`#${BACKGROUND_ID_SUFFIX}`} x={renderable.coordinate.x} y={renderable.coordinate.y} class="tile-background"/>
								);
							}
							if (renderable.poi != null) {
								if (this.tileSet.svgElementFromPoint != null) {
									els.push(this.tileSet.svgElementFromPoint(renderable.coordinate, this.renderer, renderable.poi, renderable.envItem, renderable.tile));
								} else {
									els.push(this.genericPoi(renderable.coordinate, renderable.poi));
								}
							}
						} else {
							throw new Error(`Unknown renderable type: ${renderable.renderableType}`);
						}
						return els;
					}).filter(Type.isNotNull);
					return <g class={`layer-${layer}`}>{renderedCells.map(cell => html(cell)).join("\n")}</g>;
				}).filter(Type.isNotNull).map(layer => html(layer)).join("\n")}
			</svg>
		);
		return html(
			<section>
				<figure>
					{svg}
					{this.toPoiTable()}
				</figure>
			</section>
		);
	}
}
