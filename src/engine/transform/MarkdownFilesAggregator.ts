import {MarkdownFile, MarkdownFileList, MarkdownFileListType, MarkdownFileType} from "../type/MarkdownFile";
import {isCreated, isReplay, isUpdated, OperationBase} from "../type/Operation";
import {
	SourceDirectory,
	SourceDirectoryFileList,
	SourceDirectoryFileListOperationType,
	SourceDirectoryType
} from "../type/SourceDirectory";
import {BiTransformer} from "./Transformer";

export class MarkdownFilesAggregator extends BiTransformer<OperationBase<SourceDirectoryFileList>, MarkdownFile, MarkdownFileList> {
	private readonly files: Map<string, Map<string, MarkdownFile>> = new Map<string, Map<string, MarkdownFile>>();

	constructor() {
		super(SourceDirectoryFileListOperationType, MarkdownFileType, MarkdownFileListType);
	}

	protected dirFiles(directory: SourceDirectory): Map<string, MarkdownFile> {
		let dirMap = this.files.get(directory.pathFromRoot);
		if (dirMap == null) {
			dirMap = new Map<string, MarkdownFile>();
			this.files.set(directory.pathFromRoot, dirMap);
		}
		return dirMap;
	}

	protected matchLeftRight(fileListOperation: OperationBase<SourceDirectoryFileList>, markdownFile: MarkdownFile): boolean {
		return SourceDirectoryType.equals(fileListOperation.item.sourceDirectory, markdownFile.fileText.file.directory);
	}

	onInputLeft(fileListOperation: OperationBase<SourceDirectoryFileList>) {
		if (isCreated(fileListOperation) || isUpdated(fileListOperation) || isReplay(fileListOperation)) {
			super.onInputLeft(fileListOperation);
		} else {
			throw new Error(`[${this}] Unexpected operation: ${fileListOperation.operation}`);
		}
	}

	onInputRight(markdownFile: MarkdownFile) {
		this.dirFiles(markdownFile.fileText.file.directory).set(markdownFile.fileText.file.pathFromRoot, markdownFile);
		super.onInputRight(markdownFile);
	}

	protected onInputs(fileListOperation: OperationBase<SourceDirectoryFileList>, markdownFile: MarkdownFile): void {
		const dirFiles = this.dirFiles(fileListOperation.item.sourceDirectory);
		const markdownFiles = fileListOperation.item.fileList.map(sourceFile => dirFiles.get(sourceFile.pathFromRoot));
		const emptyCount = markdownFiles.reduce((p, c) => c == null ? (p + 1) : p, 0);
		if (emptyCount === 0) {
			this.notify({
				markdownFiles: markdownFiles as MarkdownFile[],
				fileListOperation,
			});
		}
	}
}
