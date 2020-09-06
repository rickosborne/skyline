import {PLANT_UML_DATA_TYPE} from "../../template/PlantUmlRenderer";
import {FileText, FileTextType} from "./FileText";
import {
	HasTemplateBlock,
	hasTemplateBlockSubtype,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";

export interface PlantUmlFile {
	fileText: FileText;
}

export const PlantUmlFileType = Type.novel<PlantUmlFile>()
	.withTypedField("fileText", FileTextType)
	.withStringify(item => FileTextType.stringify(item.fileText))
	.withName("PlantUmlFile");

export interface PlantUmlTemplateBlock extends TemplateBlock {
	dataType: typeof PLANT_UML_DATA_TYPE;
}

export const PlantUmlTemplateBlockType = TemplateBlockType.toBuilder<PlantUmlTemplateBlock>()
	.withFixed("dataType", PLANT_UML_DATA_TYPE)
	.withParent(TemplateBlockType)
	.withName("PlantUmlTemplateBlock");

export interface PlantUmlDataBlock extends HasTemplateBlock<PlantUmlTemplateBlock> {
	plantUmlFile: PlantUmlFile;
}

export const PlantUmlDataBlockType = hasTemplateBlockSubtype<PlantUmlTemplateBlock, PlantUmlDataBlock>(PlantUmlTemplateBlockType)
	.withTypedField("plantUmlFile", PlantUmlFileType)
	.withName("PlantUmlDataBlock");

export const RenderedPlantUmlDataBlockType = renderedTemplateBlockSubtype(PlantUmlDataBlockType).withName("RenderedPlantUml");
