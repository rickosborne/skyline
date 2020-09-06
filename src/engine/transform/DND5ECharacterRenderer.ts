import * as diff from "diff";
import {Dnd5EPcStats} from "../../template/Dnd5EPcStats";
import {EngineConfig} from "../EngineConfig";
import {
	DND5ECharacterDataTemplateBlock,
	DND5ECharacterDataTemplateBlockType,
	RenderedDND5ECharacterDataType
} from "../type/BookData";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class DND5ECharacterRenderer extends Transformer<DND5ECharacterDataTemplateBlock, RenderedTemplateBlock<DND5ECharacterDataTemplateBlock>> {
	private readonly dnd5EPcStats = new Dnd5EPcStats();

	constructor(config: Partial<EngineConfig> = {}) {
		super(DND5ECharacterDataTemplateBlockType, RenderedDND5ECharacterDataType, config);
	}

	onInput(source: DND5ECharacterDataTemplateBlock): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.dnd5EPcStats.render({
			hzd: source.characterData.hzd,
			dnd5e: source.characterData.dnd5e
		});
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.logger.debug(diff.createPatch(DND5ECharacterDataTemplateBlockType.identify(source) || "", source.templateBlock.body.trim(), renderedText.trim(), undefined, undefined, {
				newlineIsToken: true,
				ignoreWhitespace: true
			}));
			this.notify({
				source,
				renderedText,
			});
		}
	}
}
