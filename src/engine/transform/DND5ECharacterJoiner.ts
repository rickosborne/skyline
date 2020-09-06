import {
	DND5ECharacterData,
	DND5ECharacterDataTemplateBlock,
	DND5ECharacterDataTemplateBlockType,
	DND5ECharacterDataType,
	DND5ECharacterTemplateBlock,
	DND5ECharacterTemplateBlockType
} from "../type/BookData";
import {BiTransformer} from "./Transformer";

export class DND5ECharacterJoiner extends BiTransformer<DND5ECharacterData, DND5ECharacterTemplateBlock, DND5ECharacterDataTemplateBlock> {
	constructor() {
		super(
			DND5ECharacterDataType,
			DND5ECharacterTemplateBlockType,
			DND5ECharacterDataTemplateBlockType,
		);
	}

	protected matchLeftRight(characterData: DND5ECharacterData, bookTemplateBlock: DND5ECharacterTemplateBlock): boolean {
		return bookTemplateBlock.keyValue.character === characterData.hzd.name;
	}

	protected onInputs(characterData: DND5ECharacterData, templateBlock: DND5ECharacterTemplateBlock): void {
		this.notify({
			characterData,
			templateBlock,
		});
	}
}
