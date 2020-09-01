import {Dnd5EPlayerCharacter} from "../../schema/book";
import {Dnd5EPcStats} from "../../template/Dnd5EPcStats";
import {BookTemplateBlock, BookTemplateBlockType, DND5ECharacterData, DND5ECharacterDataType} from "../type/BookData";
import {RenderedTemplateBlock, RenderedTemplateBlockType} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class DND5EPcRenderer extends BiTransformer<DND5ECharacterData, BookTemplateBlock, RenderedTemplateBlock<BookTemplateBlock>> {
	private readonly dnd5EPcStats = new Dnd5EPcStats();

	constructor() {
		super(
			DND5ECharacterDataType,
			BookTemplateBlockType,
			RenderedTemplateBlockType(BookTemplateBlockType),
		);
	}

	protected matchLeftRight(characterData: DND5ECharacterData, bookTemplateBlock: BookTemplateBlock): boolean {
		return bookTemplateBlock.templateBlock.keyValue.character === characterData.hzd.name;
	}

	protected onInputs(characterData: DND5ECharacterData, template: BookTemplateBlock): void {
		this.notify({
			renderedText: this.dnd5EPcStats.render({
				dnd5e: characterData.dnd5e as Dnd5EPlayerCharacter,
				hzd: characterData.hzd
			}),
			source: template,
		});
	}
}
