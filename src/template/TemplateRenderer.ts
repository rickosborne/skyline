import * as console from "console";
import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";
import {ARenderer} from "../ARenderer";
import {ATemplate} from "./ATemplate";
import {BookTemplate} from "./BookTemplate";
import {Dnd5ENpcStats} from "./Dnd5ENpcStats";
import {ifLines, ifPresent, toWords} from "./util";

const TYPED_TEMPLATES: ATemplate<any>[] = [
	new BookTemplate(),
	new Dnd5ENpcStats(),
];

export class TemplateRenderer extends ARenderer {
	public readonly templateRE = /(<!--\s+\+template\s+(\S+)\s+(\S+)\s+(\S+)\s+-->)(.*)(<!--\s+-template\s+\2\s+\3\s+\4\s+-->)/s;

	public getData(dataType: string, dataName: string): object {
		const text = fs.readFileSync(path.join("data", dataType, `${dataName}.${dataType}.yaml`), {encoding: "utf8"});
		return YAML.parse(text);
	}

	public getLookups(): object {
		return YAML.parse(fs.readFileSync(path.join("data", "lookups.yaml"), {encoding: "utf8"}));
	}

	getScanExtension(): string {
		return ".md";
	}

	public getTemplate(templateId: string): string {
		return fs.readFileSync(path.join("data", "template", `${templateId}.md`), {encoding: "utf8"});
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
		) => boolean = ((orig, upd) => orig.trim() !== upd.trim())
	): void {
		const relativePath = path.join(dir, fileName);
		const original = fs.readFileSync(relativePath, {encoding: "utf8"});
		const updated = original.replace(this.templateRE, (entire, startTag, dataType, dataName, templateId, body, endTag) => {
			// console.log(`Template: path=${relativePath}: dataType=${dataType} dataName=${dataName} templateId=${templateId}`);
			const data = this.getData(dataType, dataName);
			const result = this.render(data, `${templateId} + ${dataType}/${dataName}`, dataType, templateId);
			const shouldWrite = block(result, body, dataType, dataName, templateId, dir, fileName);
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

	protected render<T>(data: Record<string, any>, context: string, dataType: string, templateId: string): string {
		const renderer: ATemplate<T> | undefined = TYPED_TEMPLATES.filter(tt => tt.canRender(dataType, templateId)).shift();
		if (renderer != null) {
			const typed: T = renderer.convert(data);
			return renderer.render(typed);
		}
		const template = this.getTemplate(templateId);
		return this.renderCustom(template, data, context);
	}

	public renderCustom(template: string, data: Record<string, any>, context: string): string {
		// noinspection JSUnusedGlobalSymbols
		const base = {
			ifLines,
			ifPresent,
			toWords
		};
		const custom = Object.assign({}, base, this.getLookups(), data);
		const [vars, values] = Object.keys(custom).reduce(([a, b]: [any[], any[]], k: string) => {
			a.push(k)
			b.push(custom[k] as any)
			return [a, b];
		}, [[], []])
		const body = `
    	'use strict';
    	return \`${template}\`;
		`;
		const evaluate = new Function(...vars, body);
		try {
			const rendered: string = evaluate(...values);
			return rendered
				.replace(/\n[ \x09]*:trimAndNextIfEmpty:[ \x09]*\n/sg, "")
				.replace(/:trimAndNextIfEmpty:/g, "")
				.replace(/\n[ \x09]*:trimIfEmpty:/sg, "")
				.replace(/:trimIfEmpty:/g, "")
				;
		} catch (e) {
			let match;
			if ((match = (String(e.stack) as string).match(/<anonymous>:(\d+):(\d+)/))) {
				const lines = body.split(/\r?\n/g);
				const lineNum = Number(match[1]) - 3;
				console.error(`\n!!!!\n${context}\n!!!!\n${lines[lineNum - 1]}\n${lines[lineNum]}\n${lines[lineNum + 1]}\n!!!!\n`);
			}
			throw e;
		}
	}

}
