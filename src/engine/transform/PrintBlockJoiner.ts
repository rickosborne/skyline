import {isCreated, isReplay, isUpdated, OperationBase} from "../type/Operation";
import {
	HasPrintTemplateBlock,
	HasPrintTemplateBlockType,
	PrintTemplateBlock,
	PrintTemplateBlockType
} from "../type/PrintTemplateBlock";
import {
	SourceDirectoryFileList,
	SourceDirectoryFileListOperationType,
	SourceDirectoryType
} from "../type/SourceDirectory";
import {BiTransformer} from "./Transformer";

export class PrintBlockJoiner extends BiTransformer<PrintTemplateBlock, OperationBase<SourceDirectoryFileList>, HasPrintTemplateBlock> {
	constructor() {
		super(PrintTemplateBlockType, SourceDirectoryFileListOperationType, HasPrintTemplateBlockType);
	}

	protected matchLeftRight(templateBlock: PrintTemplateBlock, fileListOperation: OperationBase<SourceDirectoryFileList>): boolean {
		return SourceDirectoryType.equals(templateBlock.markdownFile.fileText.file.directory, fileListOperation.item.sourceDirectory) &&
			(isCreated(fileListOperation) || isUpdated(fileListOperation) || isReplay(fileListOperation))
			;
	}

	protected onInputs(templateBlock: PrintTemplateBlock, fileListOperation: OperationBase<SourceDirectoryFileList>): void {
		this.notify({
			fileBaseNames: fileListOperation.item.fileList
				.map(sourceFile => sourceFile.baseName)
				.sort()
				.filter(fileName => fileName.match(/^\d+-/)),
			templateBlock,
		});
	}
}
