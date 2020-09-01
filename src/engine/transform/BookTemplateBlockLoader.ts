import * as path from "path";
import {BOOK_DATA_TYPE, BookData, BookDataType, BookTemplateBlock, BookTemplateBlockType} from "../type/BookData";
import {TemplateBlock, TemplateBlockType} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class BookTemplateBlockLoader extends BiTransformer<BookData, TemplateBlock, BookTemplateBlock> {

	constructor() {
		super(
			BookDataType,
			TemplateBlockType,
			BookTemplateBlockType,
		);
	}

	bookPathFromRoot(tb: TemplateBlock): string {
		return path.join("story", tb.dataName, "book.yaml");
	}

	protected matchLeftRight(bookData: BookData, templateBlock: TemplateBlock): boolean {
		return bookData.fileText.file.pathFromRoot === this.bookPathFromRoot(templateBlock);
	}

	onInputRight(templateBlock: TemplateBlock): void {
		if (templateBlock.dataType !== BOOK_DATA_TYPE) {
			super.onInputRight(templateBlock);
		}
	}

	protected onInputs(bookData: BookData, templateBlock: TemplateBlock): void {
		this.notify({
			bookData,
			templateBlock
		});
	}
}
