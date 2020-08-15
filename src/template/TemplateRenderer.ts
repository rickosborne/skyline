import * as console from "console";
import * as fs from "fs";
import * as path from "path";
import {ARenderer} from "../ARenderer";
import {ATemplate} from "./ATemplate";
import {CypherCreature} from "./CypherCreature";
import {Dnd5ENpcStats} from "./Dnd5ENpcStats";
import {Dnd5EPcStats} from "./Dnd5EPcStats";

const TYPED_TEMPLATES: ATemplate<any>[] = [
	new Dnd5ENpcStats(),
	new Dnd5EPcStats(),
	new CypherCreature(),
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

	public markdown(
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
				kv[match[1]] = match[2];
			}
			const data = this.getData(dataType, dataName, kv);
			const result = this.render(data, `${templateId} + ${dataType}/${dataName}`, dataType, templateId, kv);
			const shouldWrite = block(result, body, dataType, dataName, templateId, dir, fileName, kv);
			if (shouldWrite) {
				console.log(`Rendered: ${templateId} + ${dataType}/${dataName} => ${relativePath}`);
				return `${startTag}\n\n${result}\n\n${endTag}`;
			}
			return entire;
		});
		if (updated !== original) {
			console.log(`Updated: ${relativePath}`);
			fs.writeFileSync(relativePath, updated, {encoding: "utf8"});
		}
	}

	protected render<T>(data: Record<string, any>, context: string, dataType: string, templateId: string, params: Record<string, string>): string {
		const renderer: ATemplate<T> | undefined = TYPED_TEMPLATES.filter(tt => tt.canRender(dataType, templateId, params)).shift();
		if (renderer != null) {
			const typed: T = renderer.convert(data, params);
			return renderer.render(typed, params);
		}
		throw new Error(`No renderers for ${context}`)
	}
}
