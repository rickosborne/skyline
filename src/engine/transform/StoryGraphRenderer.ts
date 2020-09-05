import * as diff from "diff";
import {StoryGraphPlantUml} from "../../template/StoryGraphPlantUml";
import {EngineConfig} from "../EngineConfig";
import {RenderedStoryGraphFilesType, StoryGraphFiles, StoryGraphFilesType} from "../type/StoryGraph";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class StoryGraphRenderer extends Transformer<StoryGraphFiles, RenderedTemplateBlock<StoryGraphFiles>> {
	private readonly renderer = new StoryGraphPlantUml();

	constructor(config: Partial<EngineConfig> = {}) {
		super(StoryGraphFilesType, RenderedStoryGraphFilesType, config);
	}

	onInput(source: StoryGraphFiles): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.renderer.render(source.story, source.templateBlock.keyValue, source.templateBlock.body);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.logger.debug(diff.createPatch(StoryGraphFilesType.identify(source) || "", source.templateBlock.body, renderedText, undefined, undefined, {ignoreWhitespace: true}));
			this.notify({
				renderedText,
				source: source,
			});
		}
	}
}
