import * as diff from "diff";
import {Dnd5ENpcStats} from "../../template/Dnd5ENpcStats";
import {EngineConfig} from "../EngineConfig";
import {
	DND5EMachineDataTemplateBlock,
	DND5EMachineDataTemplateBlockType,
	RenderedDND5EMachineDataTemplateBlockType
} from "../type/MachineTemplateBlock";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class DND5EMachineRenderer extends Transformer<DND5EMachineDataTemplateBlock, RenderedTemplateBlock<DND5EMachineDataTemplateBlock>> {
	private readonly dnd5ENpcStats = new Dnd5ENpcStats();

	constructor(config: Partial<EngineConfig> = {}) {
		super(DND5EMachineDataTemplateBlockType, RenderedDND5EMachineDataTemplateBlockType, config);
	}

	onInput(source: DND5EMachineDataTemplateBlock): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.dnd5ENpcStats.render(source.machineData.machine);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.logger.debug(diff.createPatch(DND5EMachineDataTemplateBlockType.identify(source) || "", source.templateBlock.body, renderedText, undefined, undefined, {ignoreWhitespace: true}));
			this.notify({
				renderedText,
				source,
			});
		}
	}
}
