import * as crypto from "crypto";
import * as diff from "diff";
import {PlantUmlRenderer} from "../../template/PlantUmlRenderer";
import {PlantUmlDataBlock, PlantUmlDataBlockType, RenderedPlantUmlDataBlockType} from "../type/PlantUmlFile";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class PlantUmlTemplateRenderer extends Transformer<PlantUmlDataBlock, RenderedTemplateBlock<PlantUmlDataBlock>> {
	private readonly plantRenderer = new PlantUmlRenderer();

	constructor() {
		super(PlantUmlDataBlockType, RenderedPlantUmlDataBlockType);
	}

	onInput(source: PlantUmlDataBlock): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const link = !!source.templateBlock.keyValue.link;
		const hash = crypto.createHash("sha256")
			.update(source.plantUmlFile.fileText.text)
			.update(String(link))
			.digest("hex");
		if (hash === source.templateBlock.keyValue.hash) {
			return;
		}
		const renderedText = this.plantRenderer.render({
			fileDir: source.plantUmlFile.fileText.file.directory.fullPath,
			fileName: source.plantUmlFile.fileText.file.fileName,
			hash,
			uml: source.plantUmlFile.fileText.text,
		}, source.templateBlock.keyValue, source.templateBlock.body)
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			console.debug(diff.createPatch(PlantUmlDataBlockType.identify(source) || "", source.templateBlock.body, renderedText, undefined, undefined, {ignoreWhitespace: true}));
			this.notify({
				renderedText,
				source,
				startTag: `<!-- +template ${source.templateBlock.dataType} ${source.templateBlock.dataName} * hash="${hash}"${link ? " link=1" : ""} -->`,
			});
		}
	}
}
