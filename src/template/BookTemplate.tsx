import {h} from 'preact';
import {Book} from '../schema/book';
import {ATemplate} from "./ATemplate";
import {html} from './hypertext';

export class BookTemplate extends ATemplate<Book> {
	canRender(dataType: string, templateId: string): boolean {
		return dataType === 'book';
	}

	convert(data: any): Book {
		const book: Book = data as Book;
		if (book.adapter != null && book.title != null) {
			return book;
		}
		throw new Error(`Not a book: ${JSON.stringify(data)}`);
	}

	getData(dataType: string, dataName: string, params: Record<string, string>): object | undefined {
		return undefined;
	}

	render(book: Book): string {
		return html(<div class="dnd5e-pc-block stat-block">
		</div>);
	}
}
