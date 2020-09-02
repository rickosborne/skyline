import * as crypto from "crypto";
import {PlantUmlRenderer} from "../../template/PlantUmlRenderer";
import {HasPlantUmlTemplateBlockType, PlantUmlDataBlock, RenderedPlantUmlDataBlockType} from "../type/PlantUmlFile";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class PlantUmlTemplateRenderer extends Transformer<PlantUmlDataBlock, RenderedTemplateBlock<PlantUmlDataBlock>> {
	private readonly plantRenderer = new PlantUmlRenderer();

	constructor() {
		super(HasPlantUmlTemplateBlockType, RenderedPlantUmlDataBlockType);
	}

	onInput(source: PlantUmlDataBlock): void {
		const link = !!source.templateBlock.keyValue.link;
		const hash = crypto.createHash("sha256")
			.update(source.plantUmlFile.fileText.text)
			.update(String(link))
			.digest("hex");
		const renderedText = this.plantRenderer.render({
			fileDir: source.plantUmlFile.fileText.file.directory.fullPath,
			fileName: source.plantUmlFile.fileText.file.fileName,
			hash,
			uml: source.plantUmlFile.fileText.text,
		}, source.templateBlock.keyValue, source.templateBlock.body)
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.notify({
				renderedText,
				source,
				startTag: `<!-- +template ${source.templateBlock.dataType} ${source.templateBlock.dataName} * hash="${hash}"${link ? " link=1" : ""} -->`,
			});
		}
	}
}
