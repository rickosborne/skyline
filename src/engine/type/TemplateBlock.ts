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

export const TemplateBlockType: Type<TemplateBlock> = Type.novel<TemplateBlock>(item => `${MarkdownFileType.stringify(item.markdownFile)} template ${item.dataType} ${item.dataName} ${item.templateId} ${JSON.stringify(item.keyValue)}`)
	.withScalarField<TemplateBlock, "body", string>("body", Type.isString)
	.withScalarField<TemplateBlock, "dataName", string>("dataName", Type.isString)
	.withScalarField<TemplateBlock, "dataType", string>("dataType", Type.isString)
	.withScalarField<TemplateBlock, "endTag", string>("endTag", Type.isString)
	.withScalarField<TemplateBlock, "entireBlock", string>("entireBlock", Type.isString)
	.withScalarField<TemplateBlock, "keyValue", Record<string, string>>("keyValue", Type.isNotNull)
	.withTypedField<TemplateBlock, "markdownFile", MarkdownFile>("markdownFile", MarkdownFileType)
	.withScalarField<TemplateBlock, "startTag", string>("startTag", Type.isString)
	.withScalarField<TemplateBlock, "templateId", string>("templateId", Type.isString)
	.withName("TemplateBlock");

export interface HasTemplateBlock<T extends TemplateBlock> {
	templateBlock: T;
}

export const HasTemplateBlockType = Type.novel<HasTemplateBlock<any>>(() => {
	throw new Error("Cannot stringify HasTemplateBlock");
})
	.withName("HasTemplateBlock");

export const hasTemplateBlockSubtype = <T extends TemplateBlock, H extends HasTemplateBlock<T>>(type: Type<T>): TypeBuilder<H> => type.toBuilder()
	.wrappedAs<H, "templateBlock">("templateBlock")
	.withParent(HasTemplateBlockType)
;

export interface RenderedTemplateBlock<T extends HasTemplateBlock<any>> {
	renderedText: string;
	source: T;
	startTag?: string;
}

export const RenderedTemplateBlockType = Type.novel<RenderedTemplateBlock<HasTemplateBlock<TemplateBlock>>>(() => {
	throw new Error(`Cannot stringify unparameterized RenderedTemplateBlock`);
})
	.withScalarField<RenderedTemplateBlock<any>, "renderedText", string>("renderedText", Type.isString)
	.withOptionalScalarField<RenderedTemplateBlock<any>, "startTag", string>("startTag", Type.isString)
	.withName("RenderedTemplateBlock");

export const renderedTemplateBlockSubtype = <T extends TemplateBlock, H extends HasTemplateBlock<T>, R extends RenderedTemplateBlock<H>>(hasTemplateType: Type<H>): TypeBuilder<R> => hasTemplateType.toBuilder()
	.wrappedAs<R, "source">("source")
	.withScalarField<R, "renderedText", string>("renderedText", Type.isString)
	.withOptionalScalarField<R, "startTag", string>("startTag", Type.isString)
	.withParent(RenderedTemplateBlockType);
