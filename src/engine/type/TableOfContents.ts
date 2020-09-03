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

export const MarkdownContentItemType = Type.novel<MarkdownContentItem>(item => MarkdownFileType.stringify(item.markdownFile))
	.withTypedField<MarkdownContentItem, "markdownFile", MarkdownFile>("markdownFile", MarkdownFileType)
	.withOptionalScalarField<MarkdownContentItem, "description", string>("description", Type.isString)
	.withScalarField<MarkdownContentItem, "indentLevel", number>("indentLevel", Type.isNumber)
	.withScalarField<MarkdownContentItem, "link", string>("link", Type.isString)
	.withScalarField<MarkdownContentItem, "notStarted", boolean>("notStarted", Type.isBoolean)
	.withScalarField<MarkdownContentItem, "startOfStory", boolean>("startOfStory", Type.isBoolean)
	.withScalarField<MarkdownContentItem, "title", string>("title", Type.isString)
	.withScalarField<MarkdownContentItem, "titleIsSpoiler", boolean>("titleIsSpoiler", Type.isBoolean)
	.withScalarField<MarkdownContentItem, "todoCount", number>("todoCount", Type.isNumber)
	.withName("MarkdownContentItem");

export interface TableOfContentsTemplateBlock extends TemplateBlock {
	dataType: typeof FILES_DATA_TYPE;
	templateId: typeof WEB_TOC_TEMPLATE_ID;
}

export const TableOfContentsTemplateBlockType = TemplateBlockType.toBuilder()
	.withFixed("dataType", FILES_DATA_TYPE)
	.withFixed("templateId", WEB_TOC_TEMPLATE_ID)
	.withParent(TemplateBlockType)
	.withName<TableOfContentsTemplateBlock>("TableOfContentsTemplateBlock");

export interface TableOfContentsItems {
	contentItems: MarkdownContentItem[];
	markdownFileList: MarkdownFileList;
}

export const TableOfContentsItemsType = MarkdownFileListType.toBuilder()
	.wrappedAs<TableOfContentsItems, "markdownFileList">("markdownFileList")
	.withTypedList<TableOfContentsItems, "contentItems", MarkdownContentItem>("contentItems", MarkdownContentItemType)
	.withName<TableOfContentsItems>("TableOfContentsItems");

export interface TableOfContentsBlock extends HasTemplateBlock<TableOfContentsTemplateBlock> {
	items: TableOfContentsItems;
}

export const TableOfContentsBlockType = hasTemplateBlockSubtype(TableOfContentsTemplateBlockType)
	.withTypedField<TableOfContentsBlock, "items", TableOfContentsItems>("items", TableOfContentsItemsType)
	.withName("TableOfContentsBlock");

export const RenderedTableOfContentsTemplateBlockType = renderedTemplateBlockSubtype(TableOfContentsBlockType).withName("RenderedTableOfContents");
