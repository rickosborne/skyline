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
import {rgbFromHex} from "./color";
import {singlePoi, svgBoxyBlob, svgHullOverlay, svgRoundedBlob, svgSquaresFromShape} from "./svgShape";

const B = TileLayer.Background;
const I = TileLayer.Interact;
const O = TileLayer.Overlay;

function layeredRender(layers: Partial<Record<TileLayer, SvgFromShape>> & { otherwise: SvgFromShape }): SvgFromShapeAndLayer {
	return layer => layers[layer] || layers.otherwise;
};

const singlePoiBoxy = layeredRender({
	[TileLayer.PointsOfInterest]: singlePoi,
	otherwise: (shape, renderer, bounds) => svgBoxyBlob(shape, bounds),
});

const singlePoiRounded = layeredRender({
	[TileLayer.PointsOfInterest]: singlePoi,
	otherwise: (shape, renderer, bounds) => svgRoundedBlob(shape, bounds),
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
		otherwise: (shape, renderer, bounds) => svgHullOverlay(shape, bounds, 0),
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
		".tall-grass-round": {
			fill: "#cc3366",
			filter: "url(#tall-grass-filter)",
		},
		".tall-grass-back": {
			fill: GrassTile.HEX_COLOR,
			filter: "url(#grass-filter)",
		},
	};
	public readonly svgFromShape = singlePoiRounded;

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return <filter id="tall-grass-filter">
			<feTurbulence type="turbulence" baseFrequency="4" numOctaves="4" result="turbulence" />
			<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G" />
		</filter>;
	}
}

export class ForestTile extends ATile implements Tile {
	public readonly color = "#33cc33";
	public readonly layer = B;
	public readonly name = "forest";
	public styles: Record<string, PropertiesHyphen> = {
		".forest-round": {
			fill: "#33cc33",
			filter: "url(#forest-filter)",
		},
		".forest-back": {
			fill: GrassTile.HEX_COLOR,
			filter: "url(#grass-filter)",
		},
	};
	public readonly svgFromShape = singlePoiRounded;

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return <filter id="forest-filter">
			<feTurbulence type="turbulence" baseFrequency="4" numOctaves="1" result="turbulence" />
			<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G" />
		</filter>;
	}
}

export class GrassTile extends ATile implements Tile {
	public static readonly HEX_COLOR = "#99ff99";
	public static readonly RGB_COLOR = rgbFromHex(GrassTile.HEX_COLOR)
	public readonly color = GrassTile.HEX_COLOR;
	public readonly layer = B;
	public readonly name = "grass";
	public styles: Record<string, PropertiesHyphen> = {
		".grass-box": {
			fill: GrassTile.HEX_COLOR,
			filter: "url(#grass-filter)"
		},
	};
	public readonly svgFromShape = singlePoiBoxy;

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return <filter id="grass-filter">
			<feTurbulence type="fractalNoise" baseFrequency="20,15" numOctaves="1" result="noise"/>
			<feColorMatrix type="matrix" values="
			0 0 0 0 0,
   		0 0 0 0 0,
   		0 0 0 0 0,
   		0 0 0 -2.5 1
   		"
				in="noise" result="mono" />
			<feBlend in="SourceGraphic" in2="mono" mode="multiply" result="withNoise" />
			<feComposite in="withNoise" in2="SourceGraphic" operator="in" />
		</filter>;
	}
}

export class MountainTile extends ATile implements Tile {
	public static readonly HEX_COLOR = "#996633"
	public static readonly RGB_COLOR = rgbFromHex(MountainTile.HEX_COLOR);
	public readonly color = MountainTile.HEX_COLOR;
	public readonly layer = B;
	public readonly name = "mountain";
	public styles: Record<string, PropertiesHyphen> = {
		".mountain-round": {
			fill: this.color,
			filter: "url(#mountain-filter)",
		},
		".mountain-back": {
			fill: GrassTile.HEX_COLOR,
			filter: "url(#grass-filter)",
			// fill: hexFromRGBColor(averageColor(MountainTile.RGB_COLOR, GrassTile.RGB_COLOR)),
		},
	};
	public readonly svgFromShape = singlePoiRounded;

// <feTurbulence type="turbulence" baseFrequency="0.4" numOctaves="3" result="turbulence" />
// <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="0.8" xChannelSelector="R" yChannelSelector="G" result="bump" />
// <feComposite in="bump" in2="diffLight" operator="arithmetic"/>
	// <feComposite in2="SourceGraphic" in="diffLight" operator="arithmetic" k2="1.5" k3="-0.5"/>

	toSvgSymbols(): JSX.Element | JSX.Element[] {
		return <filter id="mountain-filter">
			<feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="6" result="noise"/>
			<feDiffuseLighting in="noise" lighting-color="white" surfaceScale="100" result="diffLight">
				{`<feDistantLight azimuth="135" elevation="50"/>`}
			</feDiffuseLighting>
			<feTurbulence type="turbulence" baseFrequency="1" numOctaves="2" result="turbulence" />
			<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G" result="bump" />
			<feComposite in2="bump" in="diffLight" operator="in" result="textured" />
			<feComposite in2="textured" in="bump" operator="arithmetic" k2="1.5" k3="-0.5" />
		</filter>;
	}
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
