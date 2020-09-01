import {Operation, OperationBase} from "../type/Operation";
import {SourceDirectory, SourceDirectoryOperationType, SourceDirectoryType} from "../type/SourceDirectory";
import {Transformer} from "./Transformer";

export class SourceDirectoryWatcher extends Transformer<SourceDirectory, OperationBase<SourceDirectory>> {
	constructor() {
		super(SourceDirectoryType, SourceDirectoryOperationType);
	}

	onInput(item: SourceDirectory): void {
		this.notify({
			item,
			operation: Operation.Replay,
		});
	}
}
