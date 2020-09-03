import {CypherCreature} from "../../template/CypherCreature";
import {
	CypherMachineDataTemplateBlock,
	CypherMachineDataTemplateBlockType,
	RenderedCypherMachineDataTemplateBlockType
} from "../type/MachineTemplateBlock";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class CypherMachineRenderer extends Transformer<CypherMachineDataTemplateBlock, RenderedTemplateBlock<CypherMachineDataTemplateBlock>> {
	private readonly cypherCreature = new CypherCreature();

	constructor() {
		super(CypherMachineDataTemplateBlockType, RenderedCypherMachineDataTemplateBlockType);
	}

	onInput(machineTemplateBlock: CypherMachineDataTemplateBlock): void {
		const renderedText = this.cypherCreature.render(machineTemplateBlock.machineData.machine, machineTemplateBlock.templateBlock.keyValue);
		if (renderedText.trim() !== machineTemplateBlock.templateBlock.body.trim()) {
			this.notify({
				renderedText: renderedText,
				source: machineTemplateBlock
			});
		}
	}
}
