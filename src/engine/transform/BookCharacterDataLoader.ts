import {BookCharacterData, BookCharacterDataType, BookData, BookDataType} from "../type/BookData";
import {Transformer} from "./Transformer";

export class BookCharacterDataLoader extends Transformer<BookData, BookCharacterData> {
  constructor() {
    super(BookDataType, BookCharacterDataType);
  }

  onInput(bookData: BookData): void {
    const playerCharacters = bookData.book.playerCharacter;
    if (!Array.isArray(playerCharacters)) {
      return;
    }
    for (let hzd of playerCharacters) {
      this.notify({
        hzd,
        bookData,
        cypher: ((bookData.book.adapter.cypher || {}).playerCharacter || []).find(pc => pc.name === hzd.name),
        dnd5e: ((bookData.book.adapter.dnd5e || {}).playerCharacter || []).find(pc => pc.name === hzd.name),
      });
    }
  }
}

