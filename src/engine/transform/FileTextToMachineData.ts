import * as YAML from "yaml";
import {Machine} from "../../schema/machine";
import {FileText, FileTextType} from "../type/FileText";
import {MachineData, MachineDataType} from "../type/MachineTemplateBlock";
import {Transformer} from "./Transformer";

export class FileTextToMachineData extends Transformer<FileText, MachineData> {
	constructor() {
		super(FileTextType, MachineDataType);
	}

	onInput(fileText: FileText): void {
		if (fileText.file.fileName.endsWith(".machine.yaml")) {
			this.notify({
				fileText,
				machine: YAML.parse(fileText.text) as Machine,
			});
		}
	}
}
