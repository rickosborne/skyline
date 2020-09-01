import * as YAML from "yaml";
import {Book} from "../../schema/book";
import {BookData, BookDataType} from "../type/BookData";
import {FileText, FileTextType} from "../type/FileText";
import {Transformer} from "./Transformer";

export class BookDataLoader extends Transformer<FileText, BookData> {
	constructor() {
		super(FileTextType, BookDataType);
	}

	onInput(fileText: FileText): void {
		if (fileText.file.fileName === "book.yaml") {
			this.notify({
				fileText,
				book: YAML.parse(fileText.text) as Book,
			});
		}
	}
}

