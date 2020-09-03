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

export const PlantUmlFileType = FileTextType.toBuilder()
	.wrappedAs<PlantUmlFile, "fileText">("fileText")
	.withName("PlantUmlFile");

export interface PlantUmlTemplateBlock extends TemplateBlock {
	dataType: typeof PLANT_UML_DATA_TYPE;
}

export const PlantUmlTemplateBlockType = TemplateBlockType.toBuilder()
	.withFixed<PlantUmlTemplateBlock, "dataType", typeof PLANT_UML_DATA_TYPE>("dataType", PLANT_UML_DATA_TYPE)
	.withParent(TemplateBlockType)
	.withName("PlantUmlTemplateBlock");

export interface PlantUmlDataBlock extends HasTemplateBlock<PlantUmlTemplateBlock> {
	plantUmlFile: PlantUmlFile;
}

export const PlantUmlDataBlockType: Type<PlantUmlDataBlock> = hasTemplateBlockSubtype(PlantUmlTemplateBlockType)
	.withTypedField<PlantUmlDataBlock, "plantUmlFile", PlantUmlFile>("plantUmlFile", PlantUmlFileType)
	.withName("PlantUmlDataBlock");

export const RenderedPlantUmlDataBlockType = renderedTemplateBlockSubtype(PlantUmlDataBlockType).withName("RenderedPlantUml");
