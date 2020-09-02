import * as fs from "fs";
import {FileText, FileTextType} from "../type/FileText";
import {isCreated, isReplay, isUpdated} from "../type/Operation";
import {SourceFileOperation, SourceFileOperationType} from "../type/SourceFile";
import {Transformer} from "./Transformer";

export class SourceFileOperationToFileText extends Transformer<SourceFileOperation, FileText> {
	constructor() {
		super(SourceFileOperationType, FileTextType);
	}

	onInput(fileOp: SourceFileOperation): void {
		if (isCreated(fileOp) || isUpdated(fileOp) || isReplay(fileOp)) {
			const file = fileOp.item;
			const text = fs.readFileSync(file.fullPath, {encoding: "utf8"});
			this.notify({
				file,
				text
			});
		}
	}
}
