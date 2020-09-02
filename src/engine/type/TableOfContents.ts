import {ContentItem} from "../../template/WebTableOfContents";
import {MarkdownFile, MarkdownFileList, MarkdownFileListType} from "./MarkdownFile";
import {
	HasTemplateBlock,
	HasTemplateBlockSubtype,
	HasTemplateBlockType, RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const FILES_DATA_TYPE: "files" = "files";
export const WEB_TOC_TEMPLATE_ID: "web-table-of-contents" = "web-table-of-contents";

export interface MarkdownContentItem extends ContentItem {
	markdownFile: MarkdownFile;
}

export interface TableOfContentsTemplateBlock extends TemplateBlock {
	dataType: typeof FILES_DATA_TYPE;
	templateId: typeof WEB_TOC_TEMPLATE_ID;
}

export const TableOfContentsTemplateBlockType = TemplateBlockType.subtype(
	"TableOfContentsTemplateBlock",
	(item: any): item is TableOfContentsTemplateBlock => item != null && item.dataType === FILES_DATA_TYPE && item.templateId === WEB_TOC_TEMPLATE_ID,
	(a, b) => a.dataType === b.dataType && a.templateId === b.templateId,
	(a, b) => a.dataType !== b.dataType || a.templateId !== b.templateId,
	item => TemplateBlockType.stringify(item),
);

export interface TableOfContentsItems {
	contentItems: MarkdownContentItem[];
	markdownFileList: MarkdownFileList;
}

export const TableOfContentsItemsType = Type.from("TableOfContentsItems",
	(item: any): item is TableOfContentsItems => item != null && Array.isArray(item.contentItems) && MarkdownFileListType.isInstance(item.markdownFileList),
	(a, b) => MarkdownFileListType.equals(a.markdownFileList, b.markdownFileList),
	(a, b) => !equal(a.contentItems, b.contentItems),
	item => `${MarkdownFileListType.stringify(item.markdownFileList)}#${item.contentItems.length}`,
);

export interface TableOfContentsBlock extends HasTemplateBlock<TableOfContentsTemplateBlock> {
	items: TableOfContentsItems;
}

export const TableOfContentsBlockType = HasTemplateBlockSubtype<TableOfContentsTemplateBlock, TableOfContentsBlock>(
	TableOfContentsTemplateBlockType,
	"TableOfContentsBlock",
	(item: any): item is TableOfContentsBlock => TableOfContentsItemsType.isInstance(item.items),
	(a, b) => TableOfContentsItemsType.equals(a.items, b.items),
	(a, b) => TableOfContentsItemsType.hasChanged(a.items, b.items),
);

export const RenderedTableOfContentsTemplateBlockType = RenderedTemplateBlockType(TableOfContentsBlockType);
