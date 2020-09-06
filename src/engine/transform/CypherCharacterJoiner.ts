import {
	CypherCharacterData,
	CypherCharacterDataTemplateBlock,
	CypherCharacterDataTemplateBlockType,
	CypherCharacterDataType,
	CypherCharacterTemplateBlock,
	CypherCharacterTemplateBlockType
} from "../type/BookData";
import {BiTransformer} from "./Transformer";

export class CypherCharacterJoiner extends BiTransformer<CypherCharacterData, CypherCharacterTemplateBlock, CypherCharacterDataTemplateBlock> {
	constructor() {
		super(CypherCharacterDataType, CypherCharacterTemplateBlockType, CypherCharacterDataTemplateBlockType);
	}

	protected matchLeftRight(data: CypherCharacterData, template: CypherCharacterTemplateBlock): boolean {
		return data.hzd.name === template.keyValue.character;
	}

	protected onInputs(characterData: CypherCharacterData, templateBlock: CypherCharacterTemplateBlock): void {
		this.notify({
			characterData,
			templateBlock,
		});
	}
}
