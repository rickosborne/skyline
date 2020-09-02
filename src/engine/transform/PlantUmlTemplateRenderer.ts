import * as crypto from "crypto";
import {PlantUmlRenderer} from "../../template/PlantUmlRenderer";
import {
	PlantUmlDataBlock,
	PlantUmlFile,
	PlantUmlFileType,
	PlantUmlTemplateBlock,
	PlantUmlTemplateBlockType,
	RenderedPlantUmlDataBlockType
} from "../type/PlantUmlFile";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class PlantUmlTemplateRenderer extends BiTransformer<PlantUmlTemplateBlock, PlantUmlFile, RenderedTemplateBlock<PlantUmlDataBlock>> {
	private readonly plantRenderer = new PlantUmlRenderer();

	constructor() {
		super(PlantUmlTemplateBlockType, PlantUmlFileType, RenderedPlantUmlDataBlockType);
	}

	protected matchLeftRight(templateBlock: PlantUmlTemplateBlock, plantUmlFile: PlantUmlFile): boolean {
		return plantUmlFile.fileText.file.directory.pathFromRoot === "assets/puml" &&
			plantUmlFile.fileText.file.fileName === `${templateBlock.dataName}.puml`;
	}

	protected onInputs(templateBlock: PlantUmlTemplateBlock, plantUmlFile: PlantUmlFile): void {
		const link = !!templateBlock.keyValue.link;
		const hash = crypto.createHash("sha256")
			.update(plantUmlFile.fileText.text)
			.update(String(link))
			.digest("hex");
		const renderedText = this.plantRenderer.render({
			fileDir: plantUmlFile.fileText.file.directory.fullPath,
			fileName: plantUmlFile.fileText.file.fileName,
			hash,
			uml: plantUmlFile.fileText.text,
		}, templateBlock.keyValue, templateBlock.body)
		if (renderedText.trim() !== templateBlock.body.trim()) {
			this.notify({
				renderedText,
				source: {
					plantUmlFile,
					templateBlock,
				},
				startTag: `<!-- +template ${templateBlock.dataType} ${templateBlock.dataName} * hash="${hash}"${link ? " link=1" : ""} -->`,
			});
		}
	}
}
