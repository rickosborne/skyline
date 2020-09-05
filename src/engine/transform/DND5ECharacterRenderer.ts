import {Dnd5EPcStats} from "../../template/Dnd5EPcStats";
import {
	DND5ECharacterDataTemplateBlock,
	DND5ECharacterDataTemplateBlockType,
	RenderedDND5ECharacterDataType
} from "../type/BookData";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class DND5ECharacterRenderer extends Transformer<DND5ECharacterDataTemplateBlock, RenderedTemplateBlock<DND5ECharacterDataTemplateBlock>> {
	private readonly dnd5EPcStats = new Dnd5EPcStats();

	constructor() {
		super(DND5ECharacterDataTemplateBlockType, RenderedDND5ECharacterDataType);
	}

	onInput(dataTemplate: DND5ECharacterDataTemplateBlock): void {
		if (!this.hasChanged(dataTemplate)) {
			return;
		}
		this.notify({
			source: dataTemplate,
			renderedText: this.dnd5EPcStats.render({
				hzd: dataTemplate.characterData.hzd,
				dnd5e: dataTemplate.characterData.dnd5e
			}),
		})
	}
}
