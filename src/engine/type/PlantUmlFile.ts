import {PLANT_UML_DATA_TYPE} from "../../template/PlantUmlRenderer";
import {FileText, FileTextType} from "./FileText";
import {
	HasTemplateBlock,
	HasTemplateBlockSubtype,
	HasTemplateBlockType, RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
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

export interface PlantUmlTemplateBlock extends TemplateBlock {
	dataType: typeof PLANT_UML_DATA_TYPE;
}

export const PlantUmlTemplateBlockType = TemplateBlockType.subtype(
	"PlantUmlTemplateBlock",
	(item: any): item is PlantUmlTemplateBlock => item != null && item.dataType === PLANT_UML_DATA_TYPE,
	(a, b) => a.dataType === b.dataType,
	(a, b) => a.dataType !== b.dataType,
	item => TemplateBlockType.stringify(item),
);

export interface PlantUmlDataBlock extends HasTemplateBlock<PlantUmlTemplateBlock> {
	plantUmlFile: PlantUmlFile;
}

export const HasPlantUmlTemplateBlockType = HasTemplateBlockSubtype(
	PlantUmlTemplateBlockType,
	"HasPlantUmlTemplateBlock",
	(item: any): item is PlantUmlDataBlock => item != null && PlantUmlFileType.isInstance(item.plantUmlFile),
	(a, b) => PlantUmlFileType.equals(a.plantUmlFile, b.plantUmlFile),
	(a, b) => PlantUmlFileType.hasChanged(a.plantUmlFile, b.plantUmlFile),
	item => PlantUmlFileType.stringify(item.plantUmlFile) + " " + TemplateBlockType.stringify(item.templateBlock),
);

export const RenderedPlantUmlDataBlockType = RenderedTemplateBlockType(HasPlantUmlTemplateBlockType);
