import {MarkdownFileList, MarkdownFileListType} from "../type/MarkdownFile";
import {isCreated, isReplay, isUpdated} from "../type/Operation";
import {
	PrintDataBlock,
	PrintDataBlockType,
	PrintTemplateBlock,
	PrintTemplateBlockType
} from "../type/PrintTemplateBlock";
import {SourceDirectoryType} from "../type/SourceDirectory";
import {Type} from "../type/Type";
import {BiTransformer} from "./Transformer";

export class PrintBlockJoiner extends BiTransformer<PrintTemplateBlock, MarkdownFileList, PrintDataBlock> {
	constructor() {
		super(PrintTemplateBlockType, MarkdownFileListType, PrintDataBlockType);
	}

	hasChanged<T>(item: T, type: Type<T>, items: Map<string, T>): boolean {
		items.set(type.identify(item) || "", item);
		return true;  // we always want to regenerate so Jekyll will also regenerate
	}

	protected matchLeftRight(templateBlock: PrintTemplateBlock, markdownFileList: MarkdownFileList): boolean {
		const sameDirectory = SourceDirectoryType.identify(templateBlock.markdownFile.fileText.file.directory) === SourceDirectoryType.identify(markdownFileList.fileListOperation.item.sourceDirectory);
		return sameDirectory &&
			(isCreated(markdownFileList.fileListOperation) || isUpdated(markdownFileList.fileListOperation) || isReplay(markdownFileList.fileListOperation))
			;
	}

	protected onInputs(templateBlock: PrintTemplateBlock, markdownFileList: MarkdownFileList): void {
		this.notify({
			fileBaseNames: markdownFileList.fileListOperation.item.fileList
				.map(sourceFile => sourceFile.baseName)
				.sort()
				.filter(fileName => fileName.match(/^\d+-/)),
			templateBlock,
		});
	}
}
