import * as crypto from "crypto";
import {h} from 'preact';
import {ATemplate} from "./ATemplate";
import {html} from "./hypertext";
import {ScreenMap} from "./ScreenMap";

export interface MapData {
	calculatedHash: string;
	definitionHash: string;
	map: ScreenMap;
	svg: string;
}

export class MapRenderer extends ATemplate<MapData> {
	public static readonly DATA_TYPE = "map";
	public static readonly TEMPLATE_ID = "svg";

	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return (dataType === MapRenderer.DATA_TYPE) && (templateId === MapRenderer.TEMPLATE_ID);
	}

	convert(data: any, params: Record<string, string>): MapData {
		const mapData = data as MapData;
		if (mapData.map != null && mapData.calculatedHash != null && mapData.svg != null) {
			return mapData;
		}
		throw new Error(`Not map data!`);
	}

	getData(dataType: string, dataName: string, params: Record<string, string>, body: string): MapData | undefined {
		if (dataType !== MapRenderer.DATA_TYPE) {
			return undefined;
		}
		const match = body.match(/^\s*<!-- map data ([a-f0-9]+)\n(.+?)\n-->\n\n(.*)$/s);
		if (match == null) {
			throw new Error(`Busted map definition in ${dataName}`);
		}
		const definitionHash = match[1];
		const definition = match[2];
		const svg = match[3];
		const map = ScreenMap.from(definition);
		if (map == null) {
			throw new Error(`Invalid map definition in ${dataName}:\n${definition}`);
		}
		const calculatedHash = crypto.createHash("sha256")
			.update(definition)
			.update(svg)
			.digest("hex");
		return {map, calculatedHash, definitionHash, svg,};
	}

	render(data: MapData, params: Record<string, string>, originalBody: string): string | Promise<string> {
		if (data.calculatedHash === data.definitionHash) {
			return originalBody;
		}
		// const updatedSvg = data.map.toSvg().replace(/<svg[^>]*>/s, svg => svg
		// 	.replace(/\s+(width|height|style)="[^"]*"/g, "")
		// );
		// return `<!-- map data ${data.calculatedHash}\n${data.map.definition}\n-->\n\n${updatedSvg}`;
		return data.map.toDataUri().then(dataUri => {
			const updatedSvg = html(<img src={dataUri} alt={data.map.metadata.title} width="100%" />);
			return `<!-- map data ${data.calculatedHash}\n${data.map.definition}\n-->\n\n${updatedSvg}`;
		});
	}

}
