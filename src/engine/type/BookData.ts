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

export const BookDataType = FileTextType.toBuilder()
	.wrappedAs<BookData, "fileText">("fileText")
	.withScalarField<BookData, "book", Book>("book", Type.isNotNull)
	.withName("BookData");

export interface BookTemplateBlock extends TemplateBlock {
	dataType: typeof BOOK_DATA_TYPE;
}

export const BookTemplateBlockType: Type<BookTemplateBlock> = TemplateBlockType.toBuilder()
	.withFixed<BookTemplateBlock, "dataType", typeof BOOK_DATA_TYPE>("dataType", BOOK_DATA_TYPE)
	.withParent(TemplateBlockType)
	.withName("BookTemplateBlock");

export interface CypherCharacterData {
	bookData: BookData;
	cypher: CypherPlayerCharacter;
	hzd: PlayerCharacter;
}

const characterDataTypeBuilder = <T extends { bookData: BookData; hzd: PlayerCharacter }>() => BookDataType.toBuilder()
	.wrappedAs<T, "bookData">("bookData")
	.withScalarField<T, "hzd", PlayerCharacter>("hzd", Type.isNotNull);

export const CypherCharacterDataType: Type<CypherCharacterData> = characterDataTypeBuilder()
	.withScalarField<CypherCharacterData, "cypher", CypherPlayerCharacter>("cypher", Type.isNotNull)
	.withName("CypherCharacterData");

export interface DND5ECharacterData {
	bookData: BookData;
	dnd5e: Dnd5EPlayerCharacter;
	hzd: PlayerCharacter;
}

export const DND5ECharacterDataType = characterDataTypeBuilder()
	.withScalarField<DND5ECharacterData, "dnd5e", Dnd5EPlayerCharacter>("dnd5e", Type.isNotNull)
	.withName("DND5ECharacterData");

export interface DND5ECharacterTemplateBlock extends BookTemplateBlock {
	templateId: typeof DND5E_PC_TEMPLATE_ID;
}

export const DND5ECharacterTemplateBlockType = BookTemplateBlockType.toBuilder()
	.withFixed<DND5ECharacterTemplateBlock, "templateId", typeof DND5E_PC_TEMPLATE_ID>("templateId", DND5E_PC_TEMPLATE_ID)
	.withName("DND5ECharacterTemplateBlock");

export interface CypherCharacterTemplateBlock extends BookTemplateBlock {
	templateId: typeof CYPHER_PC_TEMPLATE_ID;
}

export const CypherCharacterTemplateBlockType: Type<CypherCharacterTemplateBlock> = BookTemplateBlockType.toBuilder()
	.withFixed<CypherCharacterTemplateBlock, "templateId", typeof CYPHER_PC_TEMPLATE_ID>("templateId", CYPHER_PC_TEMPLATE_ID)
	.withName("CypherCharacterTemplateBlock")

export interface CharacterDataTemplateBlock<C, B extends BookTemplateBlock> extends HasTemplateBlock<B> {
	characterData: C;
}

export const characterDataTemplateBlock = <T extends CharacterDataTemplateBlock<C, B>, C, B extends BookTemplateBlock>(name: string, type: Type<C>): Type<T> => HasTemplateBlockType.toBuilder()
	.withTypedField<T, "characterData", C>("characterData", type)
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
