import {CypherPlayerCharacter} from "../../schema/book";
import {CypherPcStats} from "../../template/CypherPcStats";
import {BiTransformer} from "./Transformer";
import {BookTemplateBlock, BookTemplateBlockType, CypherCharacterData, CypherCharacterDataType} from "../type/BookData";
import {RenderedTemplateBlock, RenderedTemplateBlockType} from "../type/TemplateBlock";

export class CypherPcRenderer extends BiTransformer<CypherCharacterData, BookTemplateBlock, RenderedTemplateBlock<BookTemplateBlock>> {
	private readonly cypherPcStats = new CypherPcStats();

	constructor() {
		super(
			CypherCharacterDataType,
			BookTemplateBlockType,
			RenderedTemplateBlockType(BookTemplateBlockType),
		);
	}

	protected matchLeftRight(cypherCharacterData: CypherCharacterData, bookTemplateBlock: BookTemplateBlock): boolean {
		return bookTemplateBlock.templateBlock.keyValue.character === cypherCharacterData.hzd.name;
	}

	protected onInputs(cypherCharacterData: CypherCharacterData, template: BookTemplateBlock): void {
		this.notify({
			renderedText: this.cypherPcStats.render({
				cypher: cypherCharacterData.cypher as CypherPlayerCharacter,
				hzd: cypherCharacterData.hzd
			}, template.templateBlock.keyValue),
			source: template,
		});
	}
}
