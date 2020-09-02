import {StoryGraphPlantUml} from "../../template/StoryGraphPlantUml";
import {StoryGraphFiles, StoryGraphFilesType} from "../type/StoryGraph";
import {RenderedTemplateBlock, RenderedTemplateBlockType} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class StoryGraphRenderer extends Transformer<StoryGraphFiles, RenderedTemplateBlock<StoryGraphFiles>> {
	private readonly renderer = new StoryGraphPlantUml();

	constructor() {
		super(StoryGraphFilesType, RenderedTemplateBlockType(StoryGraphFilesType));
	}

	onInput(source: StoryGraphFiles): void {
		const renderedText = this.renderer.render(source.story, source.templateBlock.keyValue, source.templateBlock.body);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.notify({
				renderedText,
				source: source,
			});
		}
	}
}
