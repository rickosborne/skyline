import * as fs from "fs";
import {Operation} from "../type/Operation";
import {
	SourceDirectory,
	SourceDirectoryOperation,
	SourceDirectoryOperationType,
	SourceDirectoryType
} from "../type/SourceDirectory";
import {Transformer} from "./Transformer";

export class SourceDirectoryWatcher extends Transformer<SourceDirectory, SourceDirectoryOperation> {
	constructor() {
		super(SourceDirectoryType, SourceDirectoryOperationType);
	}

	onInput(item: SourceDirectory): void {
		// Intentionally do not cache these
		this.notify({
			item,
			operation: Operation.Replay,
		});
		fs.watch(item.fullPath, {recursive: false}, (watchEvent, fileName) => {
			console.debug(`[${this}] updated ${item.pathFromRoot} because ${fileName}`);
			this.notify({
				item,
				operation: Operation.Updated,
			})
		});
	}
}
