import * as equal from "fast-deep-equal";
import * as fs from "fs";
import {Operation, OperationBase} from "../type/Operation";
import {
	SourceDirectory,
	SourceDirectoryFileList,
	SourceDirectoryFileListOperation,
	SourceDirectoryFileListOperationType
} from "../type/SourceDirectory";
import {SourceFileOperation, SourceFileOperationType} from "../type/SourceFile";
import {fileInDirectory} from "../util/FileInDirectory";
import {Transformer} from "./Transformer";

export class FilesFromDirectory extends Transformer<SourceDirectoryFileListOperation, SourceFileOperation> {
	private readonly watchers: { dir: SourceDirectory; watcher: fs.FSWatcher }[] = [];

	constructor() {
		super(SourceDirectoryFileListOperationType, SourceFileOperationType);
	}

	onInput(input: OperationBase<SourceDirectoryFileList>): void {
		input.item.fileList.forEach(sourceFile => this.notify({
			item: sourceFile,
			operation: input.operation,
		}));
		this.watch(input.item.sourceDirectory);
	}

	public watch(dir: SourceDirectory): void {
		const existing = this.watchers.find(w => equal(w.dir, dir));
		if (existing != null) {
			return;
		}
		// console.debug(`Watch: ${dir.pathFromRoot}`);
		this.watchers.push({
			dir,
			watcher: fs.watch(dir.fullPath, (watchEvent, fileName) => {
				let operation: Operation;
				switch (watchEvent) {
					case "change":
						operation = Operation.Updated;
						console.debug(`[${this}] change ${fileName}`);
						break;
					case "rename":
						if (!fileName.endsWith("~")) {
							console.debug(`[${this}] rename ${fileName}`);
						}
						return;
					default:
						throw new Error(`Unknown event type "${watchEvent}" for file "${fileName}" while watching "${dir.fullPath}".`);
				}
				this.notify({
					operation,
					item: fileInDirectory(fileName, dir),
				});
			}),
		});
	}
}
