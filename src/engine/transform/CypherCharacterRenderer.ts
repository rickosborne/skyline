import * as diff from "diff";
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

	onInput(source: CypherCharacterDataTemplateBlock): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.cypherPcStats.render({
			cypher: source.characterData.cypher,
			hzd: source.characterData.hzd,
		}, source.templateBlock.keyValue);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			console.debug(diff.createPatch(CypherCharacterDataTemplateBlockType.identify(source) || "", source.templateBlock.body.trim(), renderedText.trim(), undefined, undefined, {
				newlineIsToken: true,
				ignoreWhitespace: true
			}));
			this.notify({
				source,
				renderedText,
			});
		}
	}
}
