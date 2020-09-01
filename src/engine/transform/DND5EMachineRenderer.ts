import {Dnd5ENpcStats} from "../../template/Dnd5ENpcStats";
import {DND5E_MACHINE_TEMPLATE_ID, MachineTemplateBlock, MachineTemplateBlockType} from "../type/MachineTemplateBlock";
import {RenderedTemplateBlock, RenderedTemplateBlockType} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class DND5EMachineRenderer extends Transformer<MachineTemplateBlock, RenderedTemplateBlock<MachineTemplateBlock>> {
	private readonly dnd5ENpcStats = new Dnd5ENpcStats();

	constructor() {
		super(MachineTemplateBlockType, RenderedTemplateBlockType(MachineTemplateBlockType));
	}

	onInput(machineTemplateBlock: MachineTemplateBlock): void {
		if (machineTemplateBlock.templateBlock.templateId === DND5E_MACHINE_TEMPLATE_ID) {
			const renderedText = this.dnd5ENpcStats.render(machineTemplateBlock.machineData.machine);
			if (renderedText.trim() !== machineTemplateBlock.templateBlock.body.trim()) {
				this.notify({
					renderedText: renderedText,
					source: machineTemplateBlock
				});
			}
		}
	}
}
