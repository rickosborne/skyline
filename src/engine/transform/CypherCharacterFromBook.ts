import {Transformer} from "./Transformer";
import {BookData, BookDataType, CypherCharacterData, CypherCharacterDataType} from "../type/BookData";

export class CypherCharacterFromBook extends Transformer<BookData, CypherCharacterData> {
	constructor() {
		super(BookDataType, CypherCharacterDataType);
	}

	onInput(bookData: BookData): void {
		const cypherAdapter = bookData.book.adapter.cypher;
		const pcs = bookData.book.playerCharacter;
		if (cypherAdapter != null && pcs != null && Array.isArray(cypherAdapter.playerCharacter)) {
			pcs.forEach(hzd => cypherAdapter.playerCharacter.filter(cypher => cypher.name === hzd.name).forEach(cypher => this.notify({
				bookData,
				cypher: cypher,
				hzd,
			})));
		}
	}
}
