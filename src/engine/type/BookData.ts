import {Book, CypherPlayerCharacter, Dnd5EPlayerCharacter, PlayerCharacter} from "../../schema/book";
import {FileText, FileTextType} from "./FileText";
import {HasTemplateBlock, TemplateBlockType} from "./TemplateBlock";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const BOOK_DATA_TYPE = "book";

export interface BookData {
	book: Book;
	fileText: FileText;
}

export const BookDataType = Type.from("BookData", (item: any): item is BookData => item != null &&
	FileTextType.isInstance(item.fileText) &&
	typeof item.book != null,
	(a, b) => FileTextType.equals(a.fileText, b.fileText),
	(a, b) => !equal(a.book, b.book),
	item => item.book.title,
);

export interface BookTemplateBlock extends HasTemplateBlock {
	bookData: BookData;
}

export const BookTemplateBlockType = Type.from("BookTemplateBlock", (item: any): item is BookTemplateBlock => item != null &&
	TemplateBlockType.isInstance(item.templateBlock) &&
	BookDataType.isInstance(item.bookData),
	(a, b) => BookDataType.equals(a.bookData, b.bookData) && TemplateBlockType.equals(a.templateBlock, b.templateBlock),
	(a, b) => BookDataType.hasChanged(a.bookData, b.bookData),
	item => BookDataType.stringify(item.bookData),
);

export interface BookCharacterData {
	bookData: BookData;
	cypher: CypherPlayerCharacter | undefined;
	dnd5e: Dnd5EPlayerCharacter | undefined;
	hzd: PlayerCharacter;
}

export const BookCharacterDataType = Type.from("BookCharacterData", (item: any): item is BookCharacterData => item != null &&
	BookDataType.isInstance(item.bookData) &&
	item.hzd != null,
	(a, b) => a.hzd.name === b.hzd.name && BookDataType.equals(a.bookData, b.bookData),
	(a, b) => BookDataType.hasChanged(a.bookData, b.bookData) || !equal(a.cypher, b.cypher) || !equal(a.dnd5e, b.dnd5e) || !equal(a.hzd, b.hzd),
	item => item.hzd.name,
);

export interface CypherCharacterData {
	bookData: BookData;
	cypher: CypherPlayerCharacter;
	hzd: PlayerCharacter;
}

export const CypherCharacterDataType = Type.from("CypherCharacterData", (item: any): item is CypherCharacterData => item != null &&
	BookDataType.isInstance(item.bookData) &&
	item.hzd != null &&
	item.cypher != null,
	(a, b) => a.hzd.name === b.hzd.name && BookDataType.equals(a.bookData, b.bookData),
	(a, b) => BookDataType.hasChanged(a.bookData, b.bookData) || !equal(a.cypher, b.cypher) || !equal(a.hzd, b.hzd),
	item => item.hzd.name,
);


export interface DND5ECharacterData {
	bookData: BookData;
	dnd5e: Dnd5EPlayerCharacter;
	hzd: PlayerCharacter;
}

export const DND5ECharacterDataType = Type.from("DND5ECharacterData", (item: any): item is DND5ECharacterData => item != null &&
	BookDataType.isInstance(item.bookData) &&
	item.hzd != null &&
	item.dnd5e != null,
	(a, b) => a.hzd.name === b.hzd.name && BookDataType.equals(a.bookData, b.bookData),
	(a, b) => BookDataType.hasChanged(a.bookData, b.bookData) || !equal(a.dnd5e, b.dnd5e) || !equal(a.hzd, b.hzd),
	item => item.hzd.name,
);
