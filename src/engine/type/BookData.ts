import {Book, CypherPlayerCharacter, Dnd5EPlayerCharacter, PlayerCharacter} from "../../schema/book";
import {CYPHER_PC_TEMPLATE_ID} from "../../template/CypherPcStats";
import {DND5E_PC_TEMPLATE_ID} from "../../template/Dnd5EPcStats";
import {FileText, FileTextType} from "./FileText";
import {
	HasTemplateBlock,
	HasTemplateBlockType,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";

export const BOOK_DATA_TYPE = "book";

export interface BookData {
	book: Book;
	fileText: FileText;
}

export const BookDataType = Type.novel<BookData>()
	.withTypedField("fileText", FileTextType)
	.withScalarField("book")
	.withStringify(item => FileTextType.stringify(item.fileText))
	.withName("BookData");

export interface BookTemplateBlock extends TemplateBlock {
	dataType: typeof BOOK_DATA_TYPE;
}

export const BookTemplateBlockType = TemplateBlockType.toBuilder<BookTemplateBlock>()
	.withFixed("dataType", BOOK_DATA_TYPE)
	.withName("BookTemplateBlock");

export interface CypherCharacterData {
	bookData: BookData;
	cypher: CypherPlayerCharacter;
	hzd: PlayerCharacter;
}

const characterDataTypeBuilder = <T extends { bookData: BookData; hzd: PlayerCharacter }>() => Type.novel<T>()
	.withTypedField("bookData", BookDataType)
	.withScalarField("hzd")
	.withStringify(item => item.hzd.name);

export const CypherCharacterDataType = characterDataTypeBuilder<CypherCharacterData>()
	.withScalarField("cypher")
	.withName("CypherCharacterData");

export interface DND5ECharacterData {
	bookData: BookData;
	dnd5e: Dnd5EPlayerCharacter;
	hzd: PlayerCharacter;
}

export const DND5ECharacterDataType = characterDataTypeBuilder<DND5ECharacterData>()
	.withScalarField("dnd5e")
	.withName("DND5ECharacterData");

export interface DND5ECharacterTemplateBlock extends BookTemplateBlock {
	templateId: typeof DND5E_PC_TEMPLATE_ID;
}

export const DND5ECharacterTemplateBlockType = BookTemplateBlockType.toBuilder<DND5ECharacterTemplateBlock>()
	.withFixed("templateId", DND5E_PC_TEMPLATE_ID)
	.withName("DND5ECharacterTemplateBlock");

export interface CypherCharacterTemplateBlock extends BookTemplateBlock {
	templateId: typeof CYPHER_PC_TEMPLATE_ID;
}

export const CypherCharacterTemplateBlockType = BookTemplateBlockType.toBuilder<CypherCharacterTemplateBlock>()
	.withFixed("templateId", CYPHER_PC_TEMPLATE_ID)
	.withName("CypherCharacterTemplateBlock")

export interface CharacterDataTemplateBlock<C, B extends BookTemplateBlock> extends HasTemplateBlock<B> {
	characterData: C;
}

export const characterDataTemplateBlock = <T extends CharacterDataTemplateBlock<C, B>, C, B extends BookTemplateBlock>(name: string, type: Type<C>): Type<T> => HasTemplateBlockType.toBuilder<T>()
	.withTypedField("characterData", type)
	.withParent(HasTemplateBlockType)
	.withName(name);

export interface CypherCharacterDataTemplateBlock extends CharacterDataTemplateBlock<CypherCharacterData, CypherCharacterTemplateBlock> {
}

export const CypherCharacterDataTemplateBlockType = characterDataTemplateBlock<CypherCharacterDataTemplateBlock, CypherCharacterData, CypherCharacterTemplateBlock>("CypherCharacterDataTemplateBlock", CypherCharacterDataType);

export const RenderedCypherCharacterDataType = renderedTemplateBlockSubtype(CypherCharacterDataTemplateBlockType).withName("RenderedCypherCharacter");

export interface DND5ECharacterDataTemplateBlock extends CharacterDataTemplateBlock<DND5ECharacterData, DND5ECharacterTemplateBlock> {
}

export const DND5ECharacterDataTemplateBlockType = characterDataTemplateBlock<DND5ECharacterDataTemplateBlock, DND5ECharacterData, DND5ECharacterTemplateBlock>("DND5ECharacterDataTemplateBlock", DND5ECharacterDataType);

export const RenderedDND5ECharacterDataType = renderedTemplateBlockSubtype(DND5ECharacterDataTemplateBlockType).withName("RenderedDND5ECharacter");
