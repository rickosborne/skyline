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

export const TemplateBlockType: Type<TemplateBlock> = Type.novel<TemplateBlock>()
	.withScalarField("body", Type.isString)
	.withScalarField("dataName", Type.isString)
	.withScalarField("dataType", Type.isString)
	.withScalarField("endTag", Type.isString)
	.withScalarField("entireBlock", Type.isString)
	.withScalarField("keyValue", Type.isNotNull)
	.withTypedField("markdownFile", MarkdownFileType)
	.withScalarField("startTag", Type.isString)
	.withScalarField("templateId", Type.isString)
	.withStringify(item => `${MarkdownFileType.stringify(item.markdownFile)} template ${item.dataType} ${item.dataName} ${item.templateId} ${JSON.stringify(item.keyValue)}`)
	.withName("TemplateBlock");

export interface HasTemplateBlock<T extends TemplateBlock> {
	templateBlock: T;
}

export const HasTemplateBlockType = Type.novel<HasTemplateBlock<any>>()
	.withScalarField("templateBlock")
	.withStringify(() => {
		throw new Error("Cannot stringify HasTemplateBlock");
	})
	.withName("HasTemplateBlock");

export const hasTemplateBlockSubtype = <T extends TemplateBlock, H extends HasTemplateBlock<T>>(type: Type<T>): TypeBuilder<H> => HasTemplateBlockType.toBuilder<H>()
	.withTypedField("templateBlock", type);

export interface RenderedTemplateBlock<T extends HasTemplateBlock<any>> {
	renderedText: string;
	source: T;
	startTag?: string;
}

export const RenderedTemplateBlockType = Type.novel<RenderedTemplateBlock<HasTemplateBlock<TemplateBlock>>>()
	.withScalarField("renderedText", Type.isString)
	.withOptionalScalarField("startTag", Type.isString)
	.withScalarField("source")
	.withStringify(() => {
		throw new Error(`Cannot stringify unparameterized RenderedTemplateBlock`);
	})
	.withName("RenderedTemplateBlock");

export const renderedTemplateBlockSubtype = <T extends TemplateBlock, H extends HasTemplateBlock<T>, R extends RenderedTemplateBlock<H>>(hasTemplateType: Type<H>): TypeBuilder<R> => RenderedTemplateBlockType.toBuilder<R>()
	.withTypedField("source", hasTemplateType)
	.withScalarField("renderedText", Type.isString)
	.withOptionalScalarField("startTag", Type.isString);
