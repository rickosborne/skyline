import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";
import * as console from "console";

export class TemplateRenderer {
	public readonly templateRE = /(<!--\s+\+template\s+(\S+)\s+(\S+)\s+(\S+)\s+-->)(.*)(<!--\s+-template\s+\2\s+\3\s+\4\s+-->)/s;

	public getData(dataType: string, dataName: string): object {
		const text = fs.readFileSync(path.join('data', dataType, `${dataName}.${dataType}.yaml`), {encoding: "utf8"});
		// noinspection JSUnusedGlobalSymbols
		const base = {
			ifLines: (
				obj: string | string[] | undefined | null,
				block: (lines: string[]) => string = (lines) => lines.join('\n')
			): string => {
				if (obj == null) {
					return '';
				} else if (Array.isArray(obj)) {
					return block(obj);
				} else {
					return block([obj]);
				}
			}
		};
		return Object.assign({}, base, YAML.parse(text));
	}

	public getTemplate(templateId: string): string {
		return fs.readFileSync(path.join('data', 'template', `${templateId}.md`), {encoding: "utf8"});
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
			const template = this.getTemplate(templateId);
			const result = this.render(template, data);
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

	public render(template: string, data: Record<string, any>): string {
		const [vars, values] = Object.keys(data).reduce(([a, b]: [any[], any[]], k: string) => {
			a.push(k)
			b.push(data[k] as any)
			return [a, b];
		}, [[], []])
		const body = `
    	'use strict';
    	return \`${template}\`;
		`;
		const evaluate = new Function(...vars, body);
		const rendered: string = evaluate(...values);
		return rendered
			.replace(/\n[ \x09]*:trimAndNextIfEmpty:[ \x09]*\n/sg, '')
			.replace(/:trimAndNextIfEmpty:/g, '')
			.replace(/\n[ \x09]*:trimIfEmpty:/sg, '')
			.replace(/:trimIfEmpty:/g, '')
			;
	}

	public scan<T>(
		dir: string,
		block: (dir: string, name: string) => T,
	): T[] {
		// console.log(`Scan: ${dir}`);
		const items = fs.readdirSync(dir, {withFileTypes: true});
		const results: T[] = [];
		for (const item of items) {
			if (item.isDirectory() && !item.name.startsWith('.')) {
				const partial = this.scan(path.join(dir, item.name), block);
				results.push(...partial);
			} else if (item.isFile() && item.name.endsWith('.md')) {
				const result = block(dir, item.name);
				results.push(result);
			}
		}
		return results;
	}
}
