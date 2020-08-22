import * as fs from "fs";
import * as path from "path";
import {ATemplate} from "./ATemplate";

export interface PrintModule {
	dataName: string;
	fileBaseNames: string[];
}

export class PrintModuleTemplate extends ATemplate<PrintModule> {
	public static readonly DATA_TYPE = "module";
	public static readonly ROOT_PATH = path.normalize(path.join(__dirname, "..", ".."));
	public static readonly TEMPLATE_ID = "print-module";

	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return dataType == PrintModuleTemplate.DATA_TYPE && templateId === PrintModuleTemplate.TEMPLATE_ID;
	}

	convert(data: any, params: Record<string, string>): PrintModule {
		const printModule: PrintModule = data;
		if (Array.isArray(printModule.fileBaseNames)) {
			return printModule;
		}
		throw new Error("Not a PrintModule");
	}

	getData(dataType: string, dataName: string, params: Record<string, string>): PrintModule | undefined {
		if (dataType !== PrintModuleTemplate.DATA_TYPE) {
			return undefined;
		}
		const modulePath = path.normalize(path.join(PrintModuleTemplate.ROOT_PATH, dataName));
		if (!fs.existsSync(modulePath)) {
			throw new Error(`Unknown module path: ${dataName} (via ${PrintModuleTemplate.ROOT_PATH})`);
		}
		return {
			dataName,
			fileBaseNames: fs.readdirSync(modulePath, {encoding: "utf8", withFileTypes: true})
				.filter(file => file.isFile() && file.name.endsWith(".md"))
				.map(file => file.name)
				.filter(fileName => this.isPrintable(fileName))
				.map(fileName => fileName.replace(/\.md$/, ''))
				.sort(),
		};
	}

	public isPrintable(fileName: string): boolean {
		return !!fileName.match(/^\d+-/);
	}

	render(data: PrintModule, params: Record<string, string>, originalBody: string): string {
		return `
<a href="{{ '/${data.dataName}' | relative_url }}" id="print-module-top-link" data-source-name="${data.dataName}"></a>

{% assign fileNames = "${data.fileBaseNames.join('|')}" | split: "|" %}
{% for fileName in fileNames %}

<div data-source-file="{{ fileName }}">
    {%- capture content %}{% include_relative {{ fileName | append: ".md" }} %}{% endcapture -%}
    {%- assign lines = content | split: "
" -%}
    {%- assign firstLine = lines | first -%}
    {%- if firstLine == "---" -%}
        {%- assign dashCount = 0 -%}
        {%- assign noFM = "" -%}
        {%- for line in lines -%}
            {%- if dashCount > 1 -%}
                {%- assign noFM = noFM | append: line | append: "
" -%}
            {%- elsif line == "---" -%}
                {%- assign dashCount = dashCount | plus: 1 -%}
            {%- endif -%}
        {%- endfor -%}
{{ noFM | markdownify }}
    {%- else -%}
{{ content | markdownify }}
    {%- endif -%}
</div>

{% endfor %}
		`;
	}

}
