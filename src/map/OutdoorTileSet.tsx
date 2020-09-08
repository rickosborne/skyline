import {h, JSX} from "preact";
import {
	CARDINAL_POINTS,
	FONT_SANS_DEFAULT, SvgFromShape,
	SvgFromShapeAndLayer,
	Tile,
	TileLayer,
	TileRenderer,
	TileSet
} from "../template/TileSet";
import {ATile} from "./ATile";
import {ATileSet} from "./ATileSet";
import {ScreenMapShape} from "./MapTypes";
import {singlePoi, svgBoxyOverlay, svgHullOverlay, svgSquaresFromShape} from "./svgShape";

const B = TileLayer.Background;
const I = TileLayer.Interact;
const O = TileLayer.Overlay;

function layeredRender(layers: Partial<Record<TileLayer, SvgFromShape>> & {otherwise: SvgFromShape}): SvgFromShapeAndLayer {
	return layer => layers[layer] || layers.otherwise;
};

export class BouldersTile extends ATile implements Tile {
	public readonly color = "#dd9944";
	public readonly layer = O;
	public readonly name = "boulders";
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: shape => svgBoxyOverlay(shape)
	});
}

export class MachineSiteTile extends ATile implements Tile {
	public readonly color = "#ff9900";
	public readonly layer = O;
	public readonly name = "machine site";
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: (shape: ScreenMapShape, renderer: TileRenderer) => {
			return svgHullOverlay(shape, 0.1, el => {
				el.props.fill = "url(#machine-overlay-gradient)";
			});
		},
	});
	// public readonly svgFromShape = hullAndSingle;

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return <linearGradient id="machine-overlay-gradient" spreadMethod="repeat" x1="0" x2="0.2" y1="0" y2="0.2" gradientUnits="userSpaceOnUse">
			<stop offset="0%" stop-color="#ff0000ff" />
			<stop offset="50%" stop-color="#ff000000" />
		</linearGradient>;
	}
}

export class RoadTile extends ATile implements Tile {
	public readonly color = "#cc8033";
	public readonly joinCardinals = CARDINAL_POINTS;
	public readonly layer = B;
	public readonly name = "road";
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: svgSquaresFromShape
	});
}

export class TallGrassTile extends ATile implements Tile {
	public readonly color = "#cc3366";
	public readonly layer = B;
	public readonly name = "tall grass";
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: shape => svgBoxyOverlay(shape)
	});
}

export class ForestTile extends ATile implements Tile {
	public readonly color = "#33cc33";
	public readonly layer = B;
	public readonly name = "forest";
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: shape => svgBoxyOverlay(shape)
	});
}

export class GrassTile extends ATile implements Tile {
	public readonly color = "#99ff99";
	public readonly layer = B;
	public readonly name = "grass";
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: svgSquaresFromShape
	});
}

export class MountainTile extends ATile implements Tile {
	public readonly color = "#996633";
	public readonly layer = B;
	public readonly name = "mountain";
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: shape => svgBoxyOverlay(shape)
	});
}

export class RiverTile extends ATile implements Tile {
	public readonly color = "#6699ff";
	public readonly joinCardinals = CARDINAL_POINTS;
	public readonly layer = B;
	public readonly name = "river";
}

export class ShallowsTile extends ATile implements Tile {
	public readonly color = "#99bbff";
	public readonly joinCardinals = CARDINAL_POINTS;
	public readonly layer = B;
	public readonly name = "shallows";
}

export class OutdoorTileSet extends ATileSet implements TileSet {
	public readonly backgroundColor = "#339933";
	public readonly name = "Outdoor";
	public readonly poiBackgroundColor = "#ffff99";
	public readonly poiBorderColor = "#80804d"
	public readonly poiColor = "#000000";
	public readonly poiFont = FONT_SANS_DEFAULT;
	public readonly tiles = [
		new BouldersTile(),
		new ForestTile(),
		new GrassTile(),
		new MachineSiteTile(),
		new MountainTile(),
		new RoadTile(),
		new RiverTile(),
		new ShallowsTile(),
		new TallGrassTile(),
	];

	isAmbient(symbol: string): boolean {
		return false;
	}
}
