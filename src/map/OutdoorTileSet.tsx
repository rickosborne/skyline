import {PropertiesHyphen} from "csstype";
import {h, JSX} from "preact";
import {
	CARDINAL_POINTS,
	FONT_SANS_DEFAULT,
	SvgFromShape,
	SvgFromShapeAndLayer,
	Tile,
	TileLayer,
	TileSet
} from "../template/TileSet";
import {ATile} from "./ATile";
import {ATileSet} from "./ATileSet";
import {singlePoi, svgBoxyBlob, svgHullOverlay, svgSquaresFromShape} from "./svgShape";

const B = TileLayer.Background;
const I = TileLayer.Interact;
const O = TileLayer.Overlay;

function layeredRender(layers: Partial<Record<TileLayer, SvgFromShape>> & { otherwise: SvgFromShape }): SvgFromShapeAndLayer {
	return layer => layers[layer] || layers.otherwise;
};

const singlePoiBoxy = layeredRender({
	[TileLayer.PointsOfInterest]: singlePoi,
	otherwise: shape => svgBoxyBlob(shape)
});

export class BouldersTile extends ATile implements Tile {
	public readonly color = "#dd9944";
	public readonly layer = B;
	public readonly name = "boulders";
	public readonly styles: Record<string, PropertiesHyphen> = {
		".boulders-box": {
			fill: "#dd9944",
		},
	};
	public readonly svgFromShape = singlePoiBoxy;
}

export class MachineSiteTile extends ATile implements Tile {
	public readonly color = "#ff9900";
	public readonly layer = O;
	public readonly name = "machine site";
	public readonly styles: Record<string, PropertiesHyphen> = {
		".machine-site-overlay": {
			stroke: "#ff0000",
			"stroke-width": "0.1px",
			"stroke-linejoin": "bevel",
			"fill": "url(#machine-overlay-gradient)",
		},
	};
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: shape => svgHullOverlay(shape, 0),
	});

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return <linearGradient id="machine-overlay-gradient" spreadMethod="repeat" x1="0" x2="0.2" y1="0" y2="0.2" gradientUnits="userSpaceOnUse">
			<stop offset="0%" stop-color="#ff0000ff"/>
			<stop offset="50%" stop-color="#ff000000"/>
		</linearGradient>;
	}
}

export class RoadTile extends ATile implements Tile {
	public readonly color = "#cc8033";
	public readonly joinCardinals = CARDINAL_POINTS;
	public readonly layer = B;
	public readonly name = "road";
	public readonly styles: Record<string, PropertiesHyphen> = {
		".road-box": {
			fill: "#cc8033",
		},
	};
	public readonly svgFromShape = layeredRender({
		[TileLayer.PointsOfInterest]: singlePoi,
		otherwise: svgSquaresFromShape
	});
}

export class TallGrassTile extends ATile implements Tile {
	public readonly color = "#cc3366";
	public readonly layer = B;
	public readonly name = "tall grass";
	public styles: Record<string, PropertiesHyphen> = {
		".tall-grass-box": {
			fill: "#cc3366",
		},
	};
	public readonly svgFromShape = singlePoiBoxy;
}

export class ForestTile extends ATile implements Tile {
	public readonly color = "#33cc33";
	public readonly layer = B;
	public readonly name = "forest";
	public styles: Record<string, PropertiesHyphen> = {
		".forest-box": {
			fill: "#33cc33",
		},
	};
	public readonly svgFromShape = singlePoiBoxy;
}

export class GrassTile extends ATile implements Tile {
	public readonly color = "#99ff99";
	public readonly layer = B;
	public readonly name = "grass";
	public styles: Record<string, PropertiesHyphen> = {
		".grass-box": {
			fill: "#99ff99",
		},
	};
	public readonly svgFromShape = singlePoiBoxy;
}

export class MountainTile extends ATile implements Tile {
	public readonly color = "#996633";
	public readonly layer = B;
	public readonly name = "mountain";
	public styles: Record<string, PropertiesHyphen> = {
		".mountain-box": {
			fill: "#996633",
		},
	};
	public readonly svgFromShape = singlePoiBoxy;
}

export class RiverTile extends ATile implements Tile {
	public readonly color = "#6699ff";
	public readonly joinCardinals = CARDINAL_POINTS;
	public readonly layer = B;
	public readonly name = "river";
	public styles: Record<string, PropertiesHyphen> = {
		".river-box": {
			fill: "#6699ff",
		},
	};
	public readonly svgFromShape = singlePoiBoxy;
}

export class ShallowsTile extends ATile implements Tile {
	public readonly color = "#99bbff";
	public readonly joinCardinals = CARDINAL_POINTS;
	public readonly layer = B;
	public readonly name = "shallows";
	public styles: Record<string, PropertiesHyphen> = {
		".shallows-box": {
			fill: "#99bbff",
		},
	};
	public readonly svgFromShape = singlePoiBoxy;
}

export class OutdoorTileSet extends ATileSet implements TileSet {
	public readonly backgroundColor = "#339933";
	public readonly name = "Outdoor";
	public readonly poiBackgroundColor = "#ffff99";
	public readonly poiBorderColor = "#80804d"
	public readonly poiColor = "#000000";
	public readonly poiFont = FONT_SANS_DEFAULT;
	public readonly tiles = [
		new GrassTile(),
		new BouldersTile(),
		new MountainTile(),
		new ForestTile(),
		new RoadTile(),
		new RiverTile(),
		new ShallowsTile(),
		new TallGrassTile(),
		new MachineSiteTile(),
	];

	isAmbient(symbol: string): boolean {
		return false;
	}
}
