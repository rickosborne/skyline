import {WebTableOfContents} from "../../template/WebTableOfContents";
import {SourceDirectoryType} from "../type/SourceDirectory";
import {
	FILES_DATA_TYPE,
	TableOfContentsBlock,
	TableOfContentsBlockType,
	TableOfContentsItems,
	TableOfContentsItemsType,
	WEB_TOC_TEMPLATE_ID
} from "../type/TableOfContents";
import {
	RenderedTemplateBlock,
	RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class TableOfContentsRenderer extends BiTransformer<TemplateBlock, TableOfContentsItems, RenderedTemplateBlock<TableOfContentsBlock>> {
	protected readonly webTableOfContents: WebTableOfContents = new WebTableOfContents();

	constructor() {
		super(TemplateBlockType, TableOfContentsItemsType, RenderedTemplateBlockType(TableOfContentsBlockType));
	}

	protected matchLeftRight(templateBlock: TemplateBlock, contentsItems: TableOfContentsItems): boolean {
		return templateBlock.dataType === FILES_DATA_TYPE &&
			templateBlock.templateId === WEB_TOC_TEMPLATE_ID &&
			SourceDirectoryType.equals(contentsItems.markdownFileList.fileListOperation.item.sourceDirectory, templateBlock.markdownFile.fileText.file.directory);
	}

	protected onInputs(templateBlock: TemplateBlock, items: TableOfContentsItems): void {
		const renderedText = this.webTableOfContents.render({
			items: items.contentItems,
		}, templateBlock.keyValue, templateBlock.body);
		if (renderedText.trim() !== templateBlock.body.trim()) {
			this.notify({
				renderedText,
				source: {
					items,
					templateBlock
				},
			});
		}
	}
}
