import {
	HasPlantUmlTemplateBlockType,
	PlantUmlDataBlock,
	PlantUmlFile,
	PlantUmlFileType,
	PlantUmlTemplateBlock,
	PlantUmlTemplateBlockType
} from "../type/PlantUmlFile";
import {BiTransformer} from "./Transformer";

export class PlantUmlJoiner extends BiTransformer<PlantUmlTemplateBlock, PlantUmlFile, PlantUmlDataBlock> {

	constructor() {
		super(PlantUmlTemplateBlockType, PlantUmlFileType, HasPlantUmlTemplateBlockType);
	}

	protected matchLeftRight(templateBlock: PlantUmlTemplateBlock, plantUmlFile: PlantUmlFile): boolean {
		return plantUmlFile.fileText.file.directory.pathFromRoot === "assets/puml" &&
			plantUmlFile.fileText.file.fileName === `${templateBlock.dataName}.puml`;
	}

	protected onInputs(templateBlock: PlantUmlTemplateBlock, plantUmlFile: PlantUmlFile): void {
		this.notify({
			templateBlock,
			plantUmlFile
		});
	}
}
