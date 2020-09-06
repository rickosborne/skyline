import {MarkdownFile, MarkdownFileType} from "./MarkdownFile";
import {Type, TypeBuilder} from "./Type";

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

export function stringifyKeyValue(record?: Record<string, string>): string | undefined {
	if (record == null) {
		return undefined;
	}
	const keys = Object.keys(record);
	if (keys.length == 0) {
		return undefined;
	}
	return "{" + keys.sort().map(key => `${JSON.stringify(key)}:${JSON.stringify(record[key])}`).join(",") + "}";
}

export const TemplateBlockType: Type<TemplateBlock> = Type.novel<TemplateBlock>()
	.withScalarField("body", false, Type.isString, null, Type.strictNotEquals)
	.withScalarField("dataName", true, Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("dataType", true, Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("endTag", false, Type.isString, null, Type.strictNotEquals)
	.withScalarField("entireBlock", false, Type.isString, null, Type.strictNotEquals)
	.withScalarField("keyValue", true, Type.isNotNull, null, Type.deepNotEquals, kv => stringifyKeyValue(kv) || "", stringifyKeyValue)
	.withTypedField("markdownFile", MarkdownFileType)
	.withScalarField("startTag", false, Type.isString, null, Type.strictNotEquals)
	.withScalarField("templateId", true, Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withStringify(item => `${MarkdownFileType.stringify(item.markdownFile)} template ${item.dataType} ${item.dataName} ${item.templateId} ${JSON.stringify(item.keyValue)}`)
	.withName("TemplateBlock");

export interface HasTemplateBlock<T extends TemplateBlock> {
	templateBlock: T;
}

export const HasTemplateBlockType = Type.novel<HasTemplateBlock<any>>()
	.withScalarField("templateBlock", true, Type.isNotNull, null, Type.strictNotEquals, (value: TemplateBlock) => TemplateBlockType.stringify(value))
	.withStringify(() => {
		throw new Error("Cannot stringify HasTemplateBlock");
	})
	.withName("HasTemplateBlock");

export const hasTemplateBlockSubtype = <T extends TemplateBlock, H extends HasTemplateBlock<T>>(type: Type<T>): TypeBuilder<H, { templateBlock: T }> => HasTemplateBlockType.toBuilder<H>()
	.withTypedField("templateBlock", type);

export interface RenderedTemplateBlock<T extends HasTemplateBlock<any>> {
	renderedText: string;
	source: T;
	startTag?: string;
}

export const RenderedTemplateBlockType = Type.novel<RenderedTemplateBlock<HasTemplateBlock<TemplateBlock>>>()
	.withScalarField("renderedText", false, Type.isString, null, Type.strictNotEquals)
	.withOptionalScalarField("startTag", Type.isString, null, Type.strictNotEquals)
	.withScalarField("source", true, Type.isNotNull, null, Type.strictNotEquals, (item: HasTemplateBlock<any>) => HasTemplateBlockType.stringify(item), (item: HasTemplateBlock<any>) => HasTemplateBlockType.identify(item))
	.withStringify(() => {
		throw new Error(`Cannot stringify unparameterized RenderedTemplateBlock`);
	})
	.withName("RenderedTemplateBlock");

export const renderedTemplateBlockSubtype = <T extends TemplateBlock, H extends HasTemplateBlock<T>, R extends RenderedTemplateBlock<H>>(hasTemplateType: Type<H>): TypeBuilder<R, RenderedTemplateBlock<H>> => RenderedTemplateBlockType.toBuilder<R>()
	.withTypedField("source", hasTemplateType)
	.withScalarField("renderedText", false, Type.isString, null, Type.strictNotEquals)
	.withOptionalScalarField("startTag", Type.isString, null, Type.strictNotEquals);
