import * as console from "console";
import * as fs from "fs";
import * as path from "path";
import {ARenderer} from "../ARenderer";
import {ATemplate} from "./ATemplate";
import {CypherCreature} from "./CypherCreature";
import {CypherPcStats} from "./CypherPcStats";
import {Dnd5ENpcStats} from "./Dnd5ENpcStats";
import {Dnd5EPcStats} from "./Dnd5EPcStats";
import {PlantUmlRenderer} from "./PlantUmlRenderer";

const TYPED_TEMPLATES: ATemplate<any>[] = [
	new Dnd5ENpcStats(),
	new Dnd5EPcStats(),
	new CypherCreature(),
	new CypherPcStats(),
	new PlantUmlRenderer(),
];

export class TemplateRenderer extends ARenderer {
	public readonly templateRE = /(<!--\s+\+template\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?\s+)?-->)(.*)(<!--\s+-template\s+\2\s+\3\s+\4\s+-->)/s;

	public getData(dataType: string, dataName: string, params: Record<string, string>): object {
		for (let renderer of TYPED_TEMPLATES) {
			const data = renderer.getData(dataType, dataName, params);
			if (data != null) {
				return data;
			}
		}
		throw new Error(`Cannot load: ${dataType} ${dataName}`);
	}

	getScanExtension(): string {
		return ".md";
	}

	public markdown<T>(
		dir: string,
		fileName: string,
		block: (
			updatedBody: string,
			originalBody: string,
			dataType: string,
			dataName: string,
			templateId: string,
			templateDir: string,
			templateFileName: string,
			params: Record<string, string>,
		) => boolean = ((orig, upd) => orig.trim() !== upd.trim())
	): void {
		const relativePath = path.join(dir, fileName);
		const original = fs.readFileSync(relativePath, {encoding: "utf8"});
		const updated = original.replace(this.templateRE, (entire, startTag, dataType, dataName, templateId, keyVals, body, endTag) => {
			// console.log(`Template: path=${relativePath}: dataType=${dataType} dataName=${dataName} templateId=${templateId}`);
			const kv: Record<string, string> = {};
			let match;
			const re = /\s*(\w+)=(?:"([^"]*)"|(\S+))/g;
			while ((match = re.exec(keyVals || ""))) {
				kv[match[1]] = match[2] || match[3];
			}
			const data = this.getData(dataType, dataName, kv);
			const context = `${templateId} + ${dataType}/${dataName}`;
			const renderer: ATemplate<T> | undefined = TYPED_TEMPLATES.filter(tt => tt.canRender(dataType, templateId, kv)).shift();
			if (renderer == null) {
				throw new Error(`No renderers for ${context}`)
			}
			const typed: T = renderer.convert(data, kv);
			const result = renderer.render(typed, kv, body);
			const shouldWrite = block(result, body, dataType, dataName, templateId, dir, fileName, kv);
			const updatedStart = renderer.renderStartTag(startTag, typed, dataType, dataName, templateId, keyVals);
			const updatedEnd = renderer.renderEndTag(endTag, typed, dataType, dataName, templateId, keyVals);
			if (updatedStart !== startTag) {
				console.info(`Start Tag change:\n\tFrom: ${startTag}\n\t  To: ${updatedStart}`);
			}
			if (updatedEnd !== endTag) {
				console.info(`End Tag change:\n\tFrom: ${endTag}\n\t  To: ${updatedEnd}`);
			}
			if (shouldWrite) {
				console.info(`Need to update ${context}`);
			}
			if (shouldWrite || (updatedStart !== startTag) || (updatedEnd !== endTag)) {
				console.log(`Rendered: ${context} => ${relativePath}`);
				return `${updatedStart}\n\n${result}\n\n${updatedEnd}`;
			}
			return entire;
		});
		if (updated !== original) {
			console.log(`Updated: ${relativePath}`);
			fs.writeFileSync(relativePath, updated, {encoding: "utf8"});
		}
	}
}
