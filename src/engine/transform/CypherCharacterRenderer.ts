import {CypherPcStats} from "../../template/CypherPcStats";
import {
	BookTemplateBlock,
	CypherCharacterData,
	CypherCharacterDataTemplateBlock,
	CypherCharacterDataTemplateBlockType,
	CypherCharacterTemplateBlock,
	RenderedCypherCharacterDataType
} from "../type/BookData";
import {HasTemplateBlock, RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class CypherCharacterRenderer extends Transformer<CypherCharacterDataTemplateBlock, RenderedTemplateBlock<HasTemplateBlock<CypherCharacterTemplateBlock>>> {
	private readonly cypherPcStats = new CypherPcStats();

	constructor() {
		super(
			CypherCharacterDataTemplateBlockType,
			RenderedCypherCharacterDataType,
		);
	}

	protected matchLeftRight(cypherCharacterData: CypherCharacterData, bookTemplateBlock: BookTemplateBlock): boolean {
		return bookTemplateBlock.keyValue.character === cypherCharacterData.hzd.name;
	}

	onInput(data: CypherCharacterDataTemplateBlock): void {
		if (!this.hasChanged(data)) {
			return;
		}
		this.notify({
			renderedText: this.cypherPcStats.render({
				cypher: data.characterData.cypher,
				hzd: data.characterData.hzd,
			}, data.templateBlock.keyValue),
			source: data,
		});
	}
}
