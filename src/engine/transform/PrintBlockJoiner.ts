import {isCreated, isReplay, isUpdated} from "../type/Operation";
import {
	PrintDataBlock,
	PrintDataBlockType,
	PrintTemplateBlock,
	PrintTemplateBlockType
} from "../type/PrintTemplateBlock";
import {SourceDirectoryType} from "../type/SourceDirectory";
import {SourceDirectoryFileListOperation, SourceDirectoryFileListOperationType} from "../type/SourceFile";
import {BiTransformer} from "./Transformer";

export class PrintBlockJoiner extends BiTransformer<PrintTemplateBlock, SourceDirectoryFileListOperation, PrintDataBlock> {
	constructor() {
		super(PrintTemplateBlockType, SourceDirectoryFileListOperationType, PrintDataBlockType);
	}

	protected matchLeftRight(templateBlock: PrintTemplateBlock, fileListOperation: SourceDirectoryFileListOperation): boolean {
		return SourceDirectoryType.equals(templateBlock.markdownFile.fileText.file.directory, fileListOperation.item.sourceDirectory) &&
			(isCreated(fileListOperation) || isUpdated(fileListOperation) || isReplay(fileListOperation))
			;
	}

	protected onInputs(templateBlock: PrintTemplateBlock, fileListOperation: SourceDirectoryFileListOperation): void {
		this.notify({
			fileBaseNames: fileListOperation.item.fileList
				.map(sourceFile => sourceFile.baseName)
				.sort()
				.filter(fileName => fileName.match(/^\d+-/)),
			templateBlock,
		});
	}
}
