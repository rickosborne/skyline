import {ContentItem} from "../../template/WebTableOfContents";
import {MarkdownFile, MarkdownFileList, MarkdownFileListType} from "./MarkdownFile";
import {HasTemplateBlock, TemplateBlockType} from "./TemplateBlock";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const FILES_DATA_TYPE = "files";
export const WEB_TOC_TEMPLATE_ID = "web-table-of-contents";

export interface MarkdownContentItem extends ContentItem {
	markdownFile: MarkdownFile;
}

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

export interface TableOfContentsBlock extends HasTemplateBlock {
	items: TableOfContentsItems;
}

export const TableOfContentsBlockType = Type.from("TableOfContentsBlock",
	(item: any): item is TableOfContentsBlock => item != null &&
		TableOfContentsItemsType.isInstance(item.items),
	(a, b) => TemplateBlockType.equals(a.templateBlock, b.templateBlock) && TableOfContentsItemsType.equals(a.items, b.items),
	(a, b) => TableOfContentsItemsType.hasChanged(a.items, b.items) || TemplateBlockType.hasChanged(a.templateBlock, b.templateBlock),
	item => TableOfContentsItemsType.stringify(item.items) + " => " + TemplateBlockType.stringify(item.templateBlock),
);
