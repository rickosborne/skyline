import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";
import {Book, PlayerCharacter} from '../schema/book';
import {ATemplate} from "./ATemplate";

export const BOOK_DATA_TYPE: "book" = "book";

export abstract class ABookTemplate<T> extends ATemplate<T> {
	public static readonly DATA_TYPE = BOOK_DATA_TYPE;

	bookFromAny(data: any): Book {
		const book: Book = data as Book;
		if (book.adapter != null && book.title != null && book.$schema != null && book.$schema.endsWith('book.schema.json')) {
			return book;
		}
		throw new Error(`Not a book: ${JSON.stringify(data)}`);
	}

	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return dataType === ABookTemplate.DATA_TYPE;
	}

	getData(dataType: string, dataName: string, params: Record<string, string>): object | undefined {
		if (dataType !== ABookTemplate.DATA_TYPE) {
			return undefined;
		}
		const text = fs.readFileSync(path.join(__dirname, "..", "..", "story", dataName, "book.yaml"), {encoding: "utf8"});
		return YAML.parse(text);
	}

	playerCharacterNamed(characterName: string, book: Book): PlayerCharacter {
		if (characterName == null) {
			throw new Error(`No Character Name given.`);
		}
		const hzd = (book.playerCharacter || [] as PlayerCharacter[]).find(pc => pc.name === characterName);
		if (hzd == null) {
			throw new Error(`HZD Character not found: ${characterName}`);
		}
		return hzd;
	}

	sortByTitle<T extends { title: string | undefined }>(): (a: T, b: T) => number {
		return (a, b) => (a.title || '').localeCompare(b.title || '');
	}
}
