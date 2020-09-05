import {Dnd5ENpcStats} from "../../template/Dnd5ENpcStats";
import {
	DND5EMachineDataTemplateBlock,
	DND5EMachineDataTemplateBlockType,
	RenderedDND5EMachineDataTemplateBlockType
} from "../type/MachineTemplateBlock";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class DND5EMachineRenderer extends Transformer<DND5EMachineDataTemplateBlock, RenderedTemplateBlock<DND5EMachineDataTemplateBlock>> {
	private readonly dnd5ENpcStats = new Dnd5ENpcStats();

	constructor() {
		super(DND5EMachineDataTemplateBlockType, RenderedDND5EMachineDataTemplateBlockType);
	}

	onInput(machineTemplateBlock: DND5EMachineDataTemplateBlock): void {
		if (!this.hasChanged(machineTemplateBlock)) {
			return;
		}
		const renderedText = this.dnd5ENpcStats.render(machineTemplateBlock.machineData.machine);
		if (renderedText.trim() !== machineTemplateBlock.templateBlock.body.trim()) {
			this.notify({
				renderedText: renderedText,
				source: machineTemplateBlock
			});
		}
	}
}
