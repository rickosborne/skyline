import {BookData, BookDataType, DND5ECharacterData, DND5ECharacterDataType} from "../type/BookData";
import {Transformer} from "./Transformer";

export class DND5ECharacterFromBook extends Transformer<BookData, DND5ECharacterData> {
	constructor() {
		super(BookDataType, DND5ECharacterDataType);
	}

	onInput(bookData: BookData): void {
		const dnd5eAdapter = bookData.book.adapter.dnd5e;
		const pcs = bookData.book.playerCharacter;
		if (dnd5eAdapter != null && pcs != null && Array.isArray(dnd5eAdapter.playerCharacter)) {
			pcs.forEach(hzd => dnd5eAdapter.playerCharacter.filter(dnd5epc => dnd5epc.name === hzd.name).forEach(dnd5e => this.notify({
				bookData,
				dnd5e,
				hzd,
			})));
		}
	}
}
