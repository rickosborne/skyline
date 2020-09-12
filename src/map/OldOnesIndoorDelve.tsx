import {h, JSX} from "preact";
import {Type} from "../engine/type/Type";
import {html} from "../template/hypertext";
import {BlockLayoutBounds} from "../template/ScreenText";
import {
	CARDINAL_POINTS,
	DIAGONAL_POINTS_LOWER_HV,
	FONT_SANS_DEFAULT,
	hexFromRGB,
	nineGridReduce,
	NineGridReduce,
	Tile,
	TileLayer,
	TileRenderer,
	TileSet
} from "../template/TileSet";
import {ATile} from "./ATile";
import {ATileSet} from "./ATileSet";
import {Coordinate, ScreenMapEnvironmentItem, ScreenMapPointOfInterest, ScreenMapShape} from "./MapTypes";
import {svgBoxyBlob} from "./svgShape";

const B = TileLayer.Background;
const I = TileLayer.Interact;

export class OfficeFloor extends ATile implements Tile {
	public readonly color = hexFromRGB(128, 128, 128);
	public readonly layer = B;
	public readonly name = "office floor";
	// public readonly joinCardinals = CARDINAL_POINTS;
	public readonly svgFromShape = (layer: TileLayer) => (shape: ScreenMapShape, renderer: TileRenderer, bounds: BlockLayoutBounds) => svgBoxyBlob(shape, bounds)
}

export class OfficeDoor extends ATile implements Tile {
	public readonly color = hexFromRGB(160, 160, 160);
	public readonly layer = I;
	public readonly name = "office door";
}

export class OfficeWall extends ATile implements Tile {
	public readonly color = hexFromRGB(96, 96, 96);
	public readonly grid = CARDINAL_POINTS.reduce((grid, dir) => {
		grid[dir] = {
			absent: {"office wall": `yes-${dir.toLowerCase()}`}
		};
		return grid;
	}, {} as NineGridReduce);
	public readonly layer = B;
	public readonly name = "office wall";
	public readonly walls: Record<string, JSX.Element> = {
		"yes-n": <use href="#office-wall-h" x="0" y="0"/>,
		"yes-e": <use href="#office-wall-v" x="0.9" y="0"/>,
		"yes-s": <use href="#office-wall-h" x="0" y="0.9"/>,
		"yes-w": <use href="#office-wall-v" x="0" y="0"/>,
		"chip-ne": <use href="#office-wall-c" x="0.9" y="0"/>,
		"chip-nw": <use href="#office-wall-c" x="0" y="0"/>,
		"chip-se": <use href="#office-wall-c" x="0.9" y="0.9"/>,
		"chip-sw": <use href="#office-wall-c" x="0" y="0.9"/>,
	};
	public readonly joinCardinals = CARDINAL_POINTS;
	public readonly svgFromShape = (layer: TileLayer) => (shape: ScreenMapShape, renderer: TileRenderer, bounds: BlockLayoutBounds) => svgBoxyBlob(shape, bounds)

	public toSvgElement(coordinate: Coordinate, renderer: TileRenderer): JSX.Element {
		const wallNames = nineGridReduce(coordinate, renderer, this.grid);
		DIAGONAL_POINTS_LOWER_HV.forEach(hv => {
			if (!wallNames.includes(`yes-${hv.h}`) && !wallNames.includes(`yes-${hv.v}`) && wallNames.includes(`yes-${hv.c}`)) {
				wallNames.push(`chip-${hv.c}`);
			}
		});
		return <g transform={`translate(${coordinate.x} ${coordinate.y})`}>
			<title>Wall</title>
			<use href="#office-wall-b" x="0" y="0"/>
			{wallNames.map(yes => this.walls[yes]).filter(Type.isNotNull).map(el => html(el)).join("\n")}
		</g>;
	}

	public toSvgSymbols(): JSX.Element[] {
		return [
			// <path id="office-wall-n" d="M0,0 h1 L0.9,0.1 h-0.8 v0.8 L0,1 z" fill="black" stroke="none" />,
			<rect id="office-wall-h" width="1" height="0.1" fill="black" stroke="none"/>,
			<rect id="office-wall-v" width="0.1" height="1" fill="black" stroke="none"/>,
			<rect id="office-wall-c" width="0.1" height="0.1" fill="black" stroke="none"/>,
			<rect id="office-wall-b" x="0" y="0" width="1" height="1" fill="#333333"/>,
		];
	}
}

export class OfficeRailing extends ATile implements Tile {
	public readonly color = hexFromRGB(192, 192, 192);
	public readonly layer = B;
	public readonly name = "railing";
}

export class OfficeStairs extends ATile implements Tile {
	public readonly color = hexFromRGB(208, 208, 208);
	public readonly layer = I;
	public readonly name = "stairs";

	toSvgElement(coordinate: Coordinate, renderer: TileRenderer, envItem: ScreenMapEnvironmentItem | undefined): JSX.Element {
		let el = <use href="#office-stairs" x={coordinate.x} y={coordinate.y} width="1" height="1"/>;
		if (envItem != null && envItem.rotate != null) {
			el.props.transform = `rotate(${envItem.rotate}, ${coordinate.x + 0.5}, ${coordinate.y + 0.5})`;
		}
		return el;
	}

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return [
			<symbol id="office-stairs" viewBox="0 0 1 1">
				<title>Stairs</title>
				<rect x="0" y="0" width="0.2" height="1" fill="#999999" stroke="none"/>
				<rect x="0.2" y="0" width="0.2" height="1" fill="#aaaaaa" stroke="none"/>
				<rect x="0.4" y="0" width="0.2" height="1" fill="#bbbbbb" stroke="none"/>
				<rect x="0.6" y="0" width="0.2" height="1" fill="#cccccc" stroke="none"/>
				<rect x="0.8" y="0" width="0.2" height="1" fill="#dddddd" stroke="none"/>
			</symbol>
		];
	}
}

export class OfficeCrate extends ATile implements Tile {
	public readonly color = hexFromRGB(192, 192, 64);
	public readonly layer = I;
	public readonly name = "crate";

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return [
			<symbol id="office-crate" viewBox="0 0 1 1" width="1" height="1">
				<title>Crate</title>
				<path d="M0.05,0.5 l0.45,-0.45 l0.45,0.45 l-0.45,0.45 z" fill="none" stroke="#ccffff" stroke-width="0.05"/>
				<path d="M0.15,0.5 l0.35,-0.35 l0.35,0.35 l-0.35,0.35 z" fill="#ccffff" stroke="none"/>
			</symbol>
		];
	}
}

export class OfficeRocks extends ATile implements Tile {
	public readonly color = hexFromRGB(32, 128, 32);
	public readonly layer = B;
	public readonly name = "rocks";
}

export class OfficePuddle extends ATile implements Tile {
	public readonly color = hexFromRGB(32, 32, 128);
	public readonly layer = B;
	public readonly name = "puddle";
}

export class OldOnesIndoorDelve extends ATileSet implements TileSet {
	public readonly ambient: string[] = [" "];
	public readonly name = "Old Ones Indoor Delve";
	public readonly officeTiles = [
		new OfficeFloor(),
		new OfficeDoor(),
		new OfficeWall(),
		new OfficeRailing(),
		new OfficeStairs(),
		new OfficeCrate(),
		new OfficeRocks(),
		new OfficePuddle(),
	];
	public readonly poiBackgroundColor = "#ffff99";
	public readonly poiBorderColor = "#999933";
	public readonly poiColor = "#000000";
	public readonly poiFont = FONT_SANS_DEFAULT;

	public get tiles(): Tile[] {
		return this.officeTiles;
	}

	isAmbient(symbol: string): boolean {
		return this.ambient.includes(symbol);
	}

	public svgElementFromPoint(
		coordinate: Coordinate,
		renderer: TileRenderer,
		point: ScreenMapPointOfInterest,
		envItem: ScreenMapEnvironmentItem,
		tile: Tile,
	): JSX.Element {
		//  transform={`translate(${coordinate.x} ${coordinate.y} scale(2)`}
		if (point.overlay === "crate") {
			const crateRef =
				<use href="#office-crate" x={coordinate.x - 0.5} y={coordinate.y - 0.5} width="2" height="2"/>;
			const identifier = renderer.textAt({x: coordinate.x + 0.5, y: coordinate.y + 0.5}, point.id);
			if (point.link == null) {
				return <g>
					{crateRef}
					{identifier}
				</g>;
			} else {
				return <a href={point.link}>{crateRef}
					{identifier}</a>
			}
		} else {
			return renderer.genericPoi(coordinate, point);
		}
	}
}
