import {AFilesTemplate, RenderFileRequest, RenderFileResult} from "./AFilesTemplate";

export interface PrintModule {
	dataName: string;
	fileBaseNames: string[];
}

export const PRINT_DATA_TYPE: "module" = "module";
export const PRINT_TEMPLATE_ID: "print-module" = "print-module";

export class PrintModuleTemplate extends AFilesTemplate<PrintModule, string, undefined> {
	public readonly DATA_TYPE = PRINT_DATA_TYPE;
	public readonly TEMPLATE_ID = PRINT_TEMPLATE_ID;

	convert(data: any, params: Record<string, string>): PrintModule {
		const printModule: PrintModule = data;
		if (Array.isArray(printModule.fileBaseNames)) {
			return printModule;
		}
		throw new Error("Not a PrintModule");
	}

	render(data: PrintModule, params: Record<string, string>, originalBody: string, addGenerateDate: boolean = false): string {
		return `
<a href="{{ '/${data.dataName}' | relative_url }}" id="print-module-top-link" data-source-name="${data.dataName}"></a>

${addGenerateDate ? `{% assign generateDate = "${new Date().toISOString()}" %}` : ""}

{% assign fileNames = "${data.fileBaseNames.join("|")}" | split: "|" %}
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
		`.replace(/\n\n\n+/g, "\n\n");
	}

	renderData(dataName: string, params: Record<string, string>, fileBaseNames: string[]): PrintModule {
		return {
			dataName,
			fileBaseNames,
		};
	}

	renderFile(request: RenderFileRequest<undefined>): RenderFileResult<string, undefined> {
		return {
			file: request.fileName.replace(/\.md$/, ""),
			context: undefined,
		};
	}

}
