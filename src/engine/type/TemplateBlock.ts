import {MarkdownFile, MarkdownFileType} from "./MarkdownFile";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const TEMPLATE_REGEXP = /(?<startTag><!--\s+\+template\s+(?<dataType>\S+)\s+(?<dataName>\S+)\s+(?<templateId>\S+)\s+(?<keyValuePairs>.+?\s+)?-->)(?<body>.*)(?<endTag><!--\s+-template\s+\2\s+\3\s+\4\s+-->)/s;

export interface TemplateBlock {
	body: string;
	dataName: string;
	dataType: string;
	endTag: string;
	entireBlock: string;
	keyValue: Record<string, string>;
	markdownFile: MarkdownFile;
	startTag: string;
	templateId: string;
}

export const TemplateBlockType = Type.from("TemplateBlock", (item: any): item is TemplateBlock => item != null &&
	MarkdownFileType.isInstance(item.markdownFile) &&
	typeof item.body === "string" &&
	typeof item.dataName === "string" &&
	typeof item.dataType === "string" &&
	typeof item.endTag === "string" &&
	typeof item.entireBlock === "string" &&
	typeof item.startTag === "string" &&
	typeof item.templateId === "string" &&
	item.keyValue != null,
	(a, b) => MarkdownFileType.equals(a.markdownFile, b.markdownFile) && a.dataType === b.dataType && a.dataName === b.dataName && a.templateId === b.templateId && equal(a.keyValue, b.keyValue),
	(a, b) => a.body !== b.body || a.dataName !== b.dataName || a.dataType !== b.dataType || a.endTag !== b.endTag || a.entireBlock != b.entireBlock || MarkdownFileType.hasChanged(a.markdownFile, b.markdownFile) || !equal(a.keyValue, b.keyValue) || a.startTag !== b.startTag || a.templateId !== b.templateId,
	item => `${MarkdownFileType.stringify(item.markdownFile)} template ${item.dataType} ${item.dataName} ${item.templateId} ${JSON.stringify(item.keyValue)}`,
);

export interface HasTemplateBlock {
	templateBlock: TemplateBlock;
}

export const HasTemplateBlockType = Type.from("HasTemplateBlock",
	(item: any): item is HasTemplateBlock => TemplateBlockType.isInstance(item.templateBlock),
	(a, b) => TemplateBlockType.equals(a.templateBlock, b.templateBlock),
	(a, b) => TemplateBlockType.hasChanged(a.templateBlock, b.templateBlock),
	item => TemplateBlockType.stringify(item.templateBlock),
);


export interface RenderedTemplateBlock<T extends HasTemplateBlock> {
	renderedText: string;
	source: T;
	startTag?: string;
}

export const RenderedTemplateBlockAnyType = Type.from("RenderedTemplateBlock", (item: any): item is RenderedTemplateBlock<any> => item != null &&
	TemplateBlockType.isInstance(item.templateBlock) &&
	typeof item.renderedText === "string",
	(a, b) => a != null && b != null,
	(a, b) => a.renderedText !== b.renderedText,
	() => {
		throw new Error(`Cannot stringify unparameterized RenderedTemplateBlock`);
	}
);

export const RenderedTemplateBlockType = <T extends HasTemplateBlock>(
	sourceType: Type<T>,
) => RenderedTemplateBlockAnyType.subtype(
	`Rendered${sourceType.name}`,
	(item: any): item is RenderedTemplateBlock<T> => sourceType.isInstance(item.templateBlock),
	(a, b) => sourceType.equals(a.source, b.source),
	(a, b) => sourceType.hasChanged(a.source, b.source),
	item => sourceType.stringify(item.source),
);
