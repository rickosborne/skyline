import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import {ATemplate} from "./ATemplate";
import {svgFromPlantUml} from "./util";

interface PlantUmlData {
	fileDir: string;
	fileName: string;
	hash: string;
	uml: string;
}

export class PlantUmlRenderer extends ATemplate<PlantUmlData> {
	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		// console.log(`canRender ${dataType} -- ${templateId} -- ${JSON.stringify(params)}`);
		return dataType === "plantuml";
	}

	convert(data: any, params: Record<string, string>): PlantUmlData {
		const typed = data as PlantUmlData;
		if (typed.uml != null && typed.fileName != null && typed.fileDir != null) {
			return typed;
		}
		throw new Error(`Invalid PlantUml data structure`);
	}

	getData(dataType: string, dataName: string, params: Record<string, string>): PlantUmlData | undefined {
		if (dataType !== "plantuml") {
			return undefined;
		}
		const link = !!params.link;
		const fileName = `${dataName}.puml`;
		const fileDir = path.normalize(path.join(__dirname, "..", "..", "assets", "puml"));
		const uml = this.loadUml(path.normalize(path.join(fileDir, fileName)));
		const hash = crypto.createHash("sha256")
			.update(uml)
			.update(String(link))
			.digest("hex");
		return {
			fileDir,
			fileName,
			hash,
			uml,
		};
	}

	private loadUml(filePath: string): string {
		if (!fs.existsSync(filePath)) {
			throw new Error(`No such file: "${filePath}"`);
		}
		return fs.readFileSync(filePath, {encoding: "utf8"})
			.replace(/!include\s+([^\r\n]+)/g, (line, includePart) => {
				const fileDir = path.dirname(filePath);
				const relative = path.normalize(path.join(fileDir, includePart));
				const included = this.loadUml(relative);
				return `'${line}\n${included}`;
			})
			;
	}

	render(data: PlantUmlData, params: Record<string, string>, originalBody: string): string {
		if (params.hash && params.hash === data.hash) {
			// console.debug(`PlantUML is up to date: ${params.hash}`);
			return originalBody;
		}
		let svg = svgFromPlantUml(data.uml);
		// console.log(`Params ${JSON.stringify(params)}`);
		if (!!params.link) {
			svg = `<div class="fullscreen-svg fullscreen-able">${svg}</div>`;
		}
		return svg;
	}

	renderEndTag(
		original: string,
		data: PlantUmlData,
		dataType: string,
		dataName: string,
		templateId: string,
		params: Record<string, string>,
	): string {
		return `<!-- -template ${dataType} ${dataName} * -->`;
	}

	renderStartTag(
		original: string,
		data: PlantUmlData,
		dataType: string,
		dataName: string,
		templateId: string,
		params: Record<string, string>,
	): string {
		const link = !!params.link ? ` link=1` : "";
		return `<!-- +template ${dataType} ${dataName} * hash="${data.hash}"${link} -->`;
	}

}
