import * as fs from "fs";
import {isCreated, isDeleted, isRenamed, isReplay, isUpdated} from "../type/Operation";
import {SourceDirectoryOperation, SourceDirectoryOperationType} from "../type/SourceDirectory";
import {SourceDirectoryFileListOperation, SourceDirectoryFileListOperationType} from "../type/SourceFile";
import {fileInDirectory} from "../util/FileInDirectory";
import {Transformer} from "./Transformer";

export class FileListFromDirectory extends Transformer<SourceDirectoryOperation, SourceDirectoryFileListOperation> {
	constructor() {
		super(SourceDirectoryOperationType, SourceDirectoryFileListOperationType);
	}

	onInput(dirOp: SourceDirectoryOperation): void {
		// intentionally do not cache these
		const sourceDirectory = dirOp.item;
		if (isCreated(dirOp) || isUpdated(dirOp) || isReplay(dirOp) || isRenamed(dirOp)) {
			fs.readdir(sourceDirectory.fullPath, {encoding: "utf8", withFileTypes: true}, (err, entities) => {
				if (err) {
					throw err;
				}
				const fileList = entities.filter(ent => ent.isFile()).map(ent => fileInDirectory(ent.name, sourceDirectory));
				// console.debug(`[${this}] updated ${dirOp.item.pathFromRoot} (${fileList.length})`);
				this.notify({
					item: {
						sourceDirectory,
						fileList,
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
