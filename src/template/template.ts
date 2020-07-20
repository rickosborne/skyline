import * as fs from 'fs';
import * as console from 'console';
import * as path from 'path';
import * as YAML from 'yaml';

const sourceDirs = [
	'adapter'
];
const templateRE = /(<!--\s+\+template\s+(\S+)\s+(\S+)\s+(\S+)\s+-->)(.*)(<!--\s+-template\s+\2\s+\3\s+\4\s+-->)/s;

function scan(dir: string): void {
	console.log(`Scan: ${dir}`);
	const items = fs.readdirSync(dir, {withFileTypes: true});
	for (const item of items) {
		if (item.isDirectory() && !item.name.startsWith('.')) {
			scan(path.join(dir, item.name));
		} else if (item.isFile() && item.name.endsWith('.md')) {
			markdown(dir, item.name);
		}
	}
}

function getData(dataType: string, dataName: string): object {
	const text = fs.readFileSync(path.join('data', dataType, `${dataName}.${dataType}.yaml`), {encoding: "utf8"});
	return YAML.parse(text);
}

function getTemplate(templateId: string): string {
	return fs.readFileSync(path.join('data', 'template', `${templateId}.md`), {encoding: "utf8"});
}

function render(template: string, data: Record<string, any>): string {
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
	return evaluate(...values);
}

function markdown(dir: string, fileName: string): void {
	const relativePath = path.join(dir, fileName);
	const original = fs.readFileSync(relativePath, {encoding: "utf8"});
	const updated = original.replace(templateRE, (entire, startTag, dataType, dataName, templateId, body, endTag) => {
		console.log(`Template: path=${relativePath}: dataType=${dataType} dataName=${dataName} templateId=${templateId}`);
		const data = getData(dataType, dataName);
		const template = getTemplate(templateId);
		const result = render(template, data);
		if (result !== body) {
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

sourceDirs.forEach(sourceDir => scan(sourceDir));
