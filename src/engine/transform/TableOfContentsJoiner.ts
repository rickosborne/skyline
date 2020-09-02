import {SourceDirectoryType} from "../type/SourceDirectory";
import {
	TableOfContentsBlock,
	TableOfContentsBlockType,
	TableOfContentsItems,
	TableOfContentsItemsType,
	TableOfContentsTemplateBlock,
	TableOfContentsTemplateBlockType
} from "../type/TableOfContents";
import {BiTransformer} from "./Transformer";

export class TableOfContentsJoiner extends BiTransformer<TableOfContentsTemplateBlock, TableOfContentsItems, TableOfContentsBlock> {
	constructor() {
		super(TableOfContentsTemplateBlockType, TableOfContentsItemsType, TableOfContentsBlockType);
	}

	protected matchLeftRight(templateBlock: TableOfContentsTemplateBlock, contentsItems: TableOfContentsItems): boolean {
		return SourceDirectoryType.equals(contentsItems.markdownFileList.fileListOperation.item.sourceDirectory, templateBlock.markdownFile.fileText.file.directory);
	}

	protected onInputs(templateBlock: TableOfContentsTemplateBlock, items: TableOfContentsItems): void {
		this.notify({
			items,
			templateBlock,
		});
	}
}
