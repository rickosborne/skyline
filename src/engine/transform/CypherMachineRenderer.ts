import {CypherCreature} from "../../template/CypherCreature";
import {CYPHER_MACHINE_TEMPLATE_ID, MachineTemplateBlock, MachineTemplateBlockType} from "../type/MachineTemplateBlock";
import {RenderedTemplateBlock, RenderedTemplateBlockType} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class CypherMachineRenderer extends Transformer<MachineTemplateBlock, RenderedTemplateBlock<MachineTemplateBlock>> {
	private readonly cypherCreature = new CypherCreature();

	constructor() {
		super(MachineTemplateBlockType, RenderedTemplateBlockType(MachineTemplateBlockType));
	}

	onInput(machineTemplateBlock: MachineTemplateBlock): void {
		if (machineTemplateBlock.templateBlock.templateId === CYPHER_MACHINE_TEMPLATE_ID) {
			const renderedText = this.cypherCreature.render(machineTemplateBlock.machineData.machine, machineTemplateBlock.templateBlock.keyValue);
			if (renderedText.trim() !== machineTemplateBlock.templateBlock.body.trim()) {
				this.notify({
					renderedText: renderedText,
					source: machineTemplateBlock
				});
			}
		}
	}
}
