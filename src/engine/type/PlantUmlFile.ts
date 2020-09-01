import {FileText, FileTextType} from "./FileText";
import {HasTemplateBlock, TemplateBlockType} from "./TemplateBlock";
import {Type} from "./Type";

export interface PlantUmlFile {
	fileText: FileText;
}

export const PlantUmlFileType = Type.from("PlantUmlFile",
	(item: any): item is PlantUmlFile => item != null &&
		FileTextType.isInstance(item.fileText),
	(a, b) => FileTextType.equals(a.fileText, b.fileText),
	(a, b) => FileTextType.hasChanged(a.fileText, b.fileText),
	item => FileTextType.stringify(item.fileText),
);

export interface PlantUmlTemplateBlock extends HasTemplateBlock {
	plantUmlFile: PlantUmlFile;
}

export const PlantUmlTemplateBlockType = Type.from("PlantUmlTemplateBlock", (item: any): item is PlantUmlTemplateBlock => item != null &&
	TemplateBlockType.isInstance(item.templateBlock) &&
	PlantUmlFileType.isInstance(item.plantUmlFile),
	(a, b) => PlantUmlFileType.equals(a.plantUmlFile, b.plantUmlFile),
	(a, b) => PlantUmlFileType.hasChanged(a.plantUmlFile, b.plantUmlFile),
	item => PlantUmlFileType.stringify(item.plantUmlFile) + " " + TemplateBlockType.stringify(item.templateBlock),
);
