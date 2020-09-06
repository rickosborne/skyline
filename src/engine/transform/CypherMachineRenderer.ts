import * as diff from "diff";
import {CypherCreature} from "../../template/CypherCreature";
import {EngineConfig} from "../EngineConfig";
import {
	CypherMachineDataTemplateBlock,
	CypherMachineDataTemplateBlockType,
	RenderedCypherMachineDataTemplateBlockType
} from "../type/MachineTemplateBlock";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class CypherMachineRenderer extends Transformer<CypherMachineDataTemplateBlock, RenderedTemplateBlock<CypherMachineDataTemplateBlock>> {
	private readonly cypherCreature = new CypherCreature();

	constructor(config: Partial<EngineConfig> = {}) {
		super(CypherMachineDataTemplateBlockType, RenderedCypherMachineDataTemplateBlockType, config);
	}

	onInput(source: CypherMachineDataTemplateBlock): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.cypherCreature.render(source.machineData.machine, source.templateBlock.keyValue);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.logger.debug(diff.createPatch(CypherMachineDataTemplateBlockType.identify(source) || "", source.templateBlock.body, renderedText, undefined, undefined, {ignoreWhitespace: true}));
			this.notify({
				renderedText,
				source,
			});
		}
	}
}
