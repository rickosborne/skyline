import * as fs from 'fs';
import * as console from 'console';
import * as path from 'path';
// @ts-ignore
import * as boring from '@mjstahl/boring';
import * as YAML from 'yaml';

const sourceDirs = [
	'adapter'
];
const templateRE = /(<!--\s+\+template\s+(\S+)\s+(\S+)\s+(\S+)\s+-->)(.*)(<!--\s+-template\s+\2\s+\3\s+\4\s+-->)/s;

function scan(dir: string): void {
	console.log(`Scan: ${dir}`);
	const dirents = fs.readdirSync(dir, {withFileTypes: true});
	for (const dirent of dirents) {
		if (dirent.isDirectory() && !dirent.name.startsWith('.')) {
			scan(path.join(dir, dirent.name));
		} else if (dirent.isFile() && dirent.name.endsWith('.md')) {
			markdown(dir, dirent.name);
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

function markdown(dir: string, fileName: string): void {
	const relativePath = path.join(dir, fileName);
	const original = fs.readFileSync(relativePath, {encoding: "utf8"});
	const updated = original.replace(templateRE, (entire, startTag, dataType, dataName, templateId, body, endTag) => {
		console.log(`Template: path=${relativePath}: dataType=${dataType} dataName=${dataName} templateId=${templateId}`);
		const data = getData(dataType, dataName);
		const template = getTemplate(templateId);
		boring.render(template, data).then((result: string) => {
			if (result !== body) {
				console.log(`Rendered: ${templateId} + ${dataType}/${dataName} => ${relativePath}`);
			}
		}).catch((err: any) => {
			console.error(`Failed to render ${templateId} + ${dataType}/${dataName} => ${relativePath}`);
			console.error(err);
		});
		return body;
	});
	if (updated !== original) {
		console.log(`Updated: ${relativePath}`);
	}
}

sourceDirs.forEach(sourceDir => scan(sourceDir));
