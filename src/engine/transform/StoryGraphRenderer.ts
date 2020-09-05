import * as diff from "diff";
import {StoryGraphPlantUml} from "../../template/StoryGraphPlantUml";
import {RenderedStoryGraphFilesType, StoryGraphFiles, StoryGraphFilesType} from "../type/StoryGraph";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class StoryGraphRenderer extends Transformer<StoryGraphFiles, RenderedTemplateBlock<StoryGraphFiles>> {
	private readonly renderer = new StoryGraphPlantUml();

	constructor() {
		super(StoryGraphFilesType, RenderedStoryGraphFilesType);
	}

	onInput(source: StoryGraphFiles): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.renderer.render(source.story, source.templateBlock.keyValue, source.templateBlock.body);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			console.debug(diff.createPatch(StoryGraphFilesType.identify(source) || "", source.templateBlock.body, renderedText, undefined, undefined, {ignoreWhitespace: true}));
			this.notify({
				renderedText,
				source: source,
			});
		}
	}
}
