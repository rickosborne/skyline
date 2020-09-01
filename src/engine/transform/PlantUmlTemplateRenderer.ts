import * as crypto from "crypto";
import {PlantUmlRenderer} from "../../template/PlantUmlRenderer";
import {PlantUmlFile, PlantUmlFileType, PlantUmlTemplateBlock, PlantUmlTemplateBlockType} from "../type/PlantUmlFile";
import {
	RenderedTemplateBlock,
	RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class PlantUmlTemplateRenderer extends BiTransformer<TemplateBlock, PlantUmlFile, RenderedTemplateBlock<PlantUmlTemplateBlock>> {
	private readonly plantRenderer = new PlantUmlRenderer();

	constructor() {
		super(TemplateBlockType, PlantUmlFileType, RenderedTemplateBlockType(PlantUmlTemplateBlockType));
	}

	protected matchLeftRight(templateBlock: TemplateBlock, plantUmlFile: PlantUmlFile): boolean {
		return templateBlock.dataType === this.plantRenderer.dataType &&
			plantUmlFile.fileText.file.directory.pathFromRoot === "assets/puml" &&
			plantUmlFile.fileText.file.fileName === `${templateBlock.dataName}.puml`;
	}

	protected onInputs(templateBlock: TemplateBlock, plantUmlFile: PlantUmlFile): void {
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
