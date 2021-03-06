import {ContentItem} from "../../template/WebTableOfContents";
import {MarkdownFile, MarkdownFileList, MarkdownFileListType, MarkdownFileType} from "./MarkdownFile";
import {
	HasTemplateBlock,
	hasTemplateBlockSubtype,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";

export const FILES_DATA_TYPE: "files" = "files";
export const WEB_TOC_TEMPLATE_ID: "web-table-of-contents" = "web-table-of-contents";

export interface MarkdownContentItem extends ContentItem {
	markdownFile: MarkdownFile;
}

export const MarkdownContentItemType = Type.novel<MarkdownContentItem>()
	.withTypedField("markdownFile", MarkdownFileType)
	.withOptionalScalarField("description")
	.withScalarField("indentLevel", false, Type.isNumber, null, Type.strictNotEquals)
	.withScalarField("link", false, Type.isString, null, Type.strictNotEquals)
	.withScalarField("notStarted", false, Type.isBoolean, null, Type.strictNotEquals)
	.withScalarField("startOfStory", false, Type.isBoolean, null, Type.strictNotEquals)
	.withScalarField("title", false, Type.isString, null, Type.strictNotEquals)
	.withScalarField("titleIsSpoiler", false, Type.isBoolean, null, Type.strictNotEquals)
	.withScalarField("todoCount", false, Type.isNumber, null, Type.strictNotEquals)
	.withStringify(item => MarkdownFileType.stringify(item.markdownFile))
	.withName("MarkdownContentItem");

export interface TableOfContentsTemplateBlock extends TemplateBlock {
	dataType: typeof FILES_DATA_TYPE;
	templateId: typeof WEB_TOC_TEMPLATE_ID;
}

export const TableOfContentsTemplateBlockType = TemplateBlockType.toBuilder<TableOfContentsTemplateBlock>()
	.withFixed("dataType", FILES_DATA_TYPE)
	.withFixed("templateId", WEB_TOC_TEMPLATE_ID)
	.withParent(TemplateBlockType)
	.withName("TableOfContentsTemplateBlock");

export interface TableOfContentsItems {
	contentItems: MarkdownContentItem[];
	markdownFileList: MarkdownFileList;
}

export const TableOfContentsItemsType = Type.novel<TableOfContentsItems>()
	.withTypedField("markdownFileList", MarkdownFileListType)
	.withTypedList("contentItems", MarkdownContentItemType)
	.withStringify(item => MarkdownFileListType.stringify(item.markdownFileList) + "+" + item.contentItems.length)
	.withName("TableOfContentsItems");

export interface TableOfContentsBlock extends HasTemplateBlock<TableOfContentsTemplateBlock> {
	items: TableOfContentsItems;
}

export const TableOfContentsBlockType = hasTemplateBlockSubtype<TableOfContentsTemplateBlock, TableOfContentsBlock>(TableOfContentsTemplateBlockType)
	.withTypedField("items", TableOfContentsItemsType)
	.withName("TableOfContentsBlock");

export const RenderedTableOfContentsTemplateBlockType = renderedTemplateBlockSubtype(TableOfContentsBlockType).withName("RenderedTableOfContents");
