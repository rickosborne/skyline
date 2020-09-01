import * as fs from "fs";
import {isCreated, isDeleted, isRenamed, isReplay, isUpdated, OperationBase} from "../type/Operation";
import {
	SourceDirectory,
	SourceDirectoryFileList,
	SourceDirectoryFileListOperationType,
	SourceDirectoryOperationType
} from "../type/SourceDirectory";
import {fileInDirectory} from "../util/FileInDirectory";
import {Transformer} from "./Transformer";

export class SourceFileListFromDirectory extends Transformer<OperationBase<SourceDirectory>, OperationBase<SourceDirectoryFileList>> {
	constructor() {
		super(SourceDirectoryOperationType, SourceDirectoryFileListOperationType);
	}

	onInput(dirOp: OperationBase<SourceDirectory>): void {
		const sourceDirectory = dirOp.item;
		if (isCreated(dirOp) || isUpdated(dirOp) || isReplay(dirOp) || isRenamed(dirOp)) {
			fs.readdir(sourceDirectory.fullPath, {encoding: "utf8", withFileTypes: true}, (err, entities) => {
				if (err) {
					throw err;
				}
				this.notify({
					item: {
						sourceDirectory,
						fileList: entities.filter(ent => ent.isFile()).map(ent => fileInDirectory(ent.name, sourceDirectory)),
					},
					operation: dirOp.operation,
				});
			});
		} else if (isDeleted(dirOp)) {
			this.notify({
				item: {
					sourceDirectory,
					fileList: [],
				},
				operation: dirOp.operation,
			});
		} else {
			throw new Error(`Unhandled operation type: ${dirOp.operation}`);
		}
	}
}
