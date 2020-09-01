import * as fs from "fs";
import {Transformer} from "./Transformer";
import {FileText, FileTextType} from "../type/FileText";
import {isCreated, isReplay, isUpdated, OperationBase} from "../type/Operation";
import {SourceFile, SourceFileOperationType} from "../type/SourceFile";

export class FileReader extends Transformer<OperationBase<SourceFile>, FileText> {
	constructor() {
		super(SourceFileOperationType, FileTextType);
	}

	onInput(fileOp: OperationBase<SourceFile>): void {
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
