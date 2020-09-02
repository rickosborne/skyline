import {Book, CypherPlayerCharacter, Dnd5EPlayerCharacter, PlayerCharacter} from "../../schema/book";
import {CYPHER_PC_TEMPLATE_ID} from "../../template/CypherPcStats";
import {DND5E_PC_TEMPLATE_ID} from "../../template/Dnd5EPcStats";
import {FileText, FileTextType} from "./FileText";
import {
	HasTemplateBlock,
	HasTemplateBlockSubtype,
	HasTemplateBlockType,
	RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
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

export interface BookTemplateBlock extends TemplateBlock {
	dataType: typeof BOOK_DATA_TYPE;
}

export const BookTemplateBlockType = TemplateBlockType.subtype(
	"BookTemplateBlock",
	(item: any): item is BookTemplateBlock => item != null && item.dataType === BOOK_DATA_TYPE,
	(a, b) => a.dataType === b.dataType,
	(a, b) => a.dataType !== b.dataType,
	item => TemplateBlockType.stringify(item),
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

export interface DND5ECharacterTemplateBlock extends BookTemplateBlock {
	templateId: typeof DND5E_PC_TEMPLATE_ID;
}

export const DND5ECharacterTemplateBlockType = BookTemplateBlockType.subtype(
	"DND5ECharacterTemplateBlock",
	(item: any): item is DND5ECharacterTemplateBlock => item != null && item.templateId === DND5E_PC_TEMPLATE_ID,
	(a, b) => a.templateId === b.templateId,
	(a, b) => a.templateId !== b.templateId,
	item => BookTemplateBlockType.stringify(item),
);

export interface CypherCharacterTemplateBlock extends BookTemplateBlock {
	templateId: typeof CYPHER_PC_TEMPLATE_ID;
}

export const CypherCharacterTemplateBlockType = BookTemplateBlockType.subtype(
	"CypherCharacterTemplateBlock",
	(item: any): item is CypherCharacterTemplateBlock => item != null && item.templateId === CYPHER_PC_TEMPLATE_ID,
	(a, b) => a.templateId === b.templateId,
	(a, b) => a.templateId !== b.templateId,
	item => BookTemplateBlockType.stringify(item),
);

export interface CharacterDataTemplateBlock<C, B extends BookTemplateBlock> extends HasTemplateBlock<B> {
	characterData: C;
}

export interface CypherCharacterDataTemplateBlock extends CharacterDataTemplateBlock<CypherCharacterData, CypherCharacterTemplateBlock> {
}

export const CypherCharacterDataTemplateBlockType = HasTemplateBlockSubtype(
	CypherCharacterTemplateBlockType,
	"CypherCharacterDataTemplateBlock",
	(item: any): item is CypherCharacterDataTemplateBlock => item != null && CypherCharacterDataType.isInstance(item.characterData),
	(a, b) => CypherCharacterDataType.equals(a.characterData, b.characterData),
	(a, b) => CypherCharacterDataType.hasChanged(a.characterData, b.characterData),
	item => CypherCharacterDataType.stringify(item.characterData) + " " + HasTemplateBlockType.stringify(item),
);

export const RenderedCypherCharacterDataType = RenderedTemplateBlockType(CypherCharacterDataTemplateBlockType);

export interface DND5ECharacterDataTemplateBlock extends CharacterDataTemplateBlock<DND5ECharacterData, DND5ECharacterTemplateBlock> {
}

export const DND5ECharacterDataTemplateBlockType = HasTemplateBlockSubtype(
	DND5ECharacterTemplateBlockType,
	"DND5ECharacterDataTemplateBlock",
	(item: any): item is DND5ECharacterDataTemplateBlock => item != null && DND5ECharacterDataType.isInstance(item.characterData),
	(a, b) => DND5ECharacterDataType.equals(a.characterData, b.characterData),
	(a, b) => DND5ECharacterDataType.hasChanged(a.characterData, b.characterData),
	item => DND5ECharacterDataType.stringify(item.characterData) + " " + HasTemplateBlockType.stringify(item),
);

export const RenderedDND5ECharacterDataType = RenderedTemplateBlockType(DND5ECharacterDataTemplateBlockType);
