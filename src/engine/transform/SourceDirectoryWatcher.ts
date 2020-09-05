import * as fs from "fs";
import {EngineConfig} from "../EngineConfig";
import {Operation} from "../type/Operation";
import {
	SourceDirectory,
	SourceDirectoryOperation,
	SourceDirectoryOperationType,
	SourceDirectoryType
} from "../type/SourceDirectory";
import {Transformer} from "./Transformer";

export class SourceDirectoryWatcher extends Transformer<SourceDirectory, SourceDirectoryOperation> {
	constructor(config: Partial<EngineConfig> = {}) {
		super(SourceDirectoryType, SourceDirectoryOperationType, config);
	}

	onInput(item: SourceDirectory): void {
		// Intentionally do not cache these
		this.notify({
			item,
			operation: Operation.Replay,
		});
		fs.watch(item.fullPath, {recursive: false}, (watchEvent, fileName) => {
			if (fileName != null && fileName.endsWith("~")) {
				return;
			}
			this.logger.debug(`Update ${item.pathFromRoot} because ${fileName}`);
			this.notify({
				item,
				operation: Operation.Updated,
			});
		});
	}
}
