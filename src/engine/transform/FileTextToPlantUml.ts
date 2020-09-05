import {FileText, FileTextType} from "../type/FileText";
import {PlantUmlFile, PlantUmlFileType} from "../type/PlantUmlFile";
import {Transformer} from "./Transformer";

export class FileTextToPlantUml extends Transformer<FileText, PlantUmlFile> {
	constructor() {
		super(FileTextType, PlantUmlFileType);
	}

	onInput(fileText: FileText): void {
		if (fileText.file.fileName.endsWith(".puml")) {
			if (!this.hasChanged(fileText)) {
				return;
			}
			this.notify({
				fileText,
			});
		}
	}
}
