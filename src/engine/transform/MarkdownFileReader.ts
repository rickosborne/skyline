import {getFrontMatter, getTitle} from "../../template/util";
import {FileText, FileTextType} from "../type/FileText";
import {HeadingLevel, MarkdownFile, MarkdownFileType} from "../type/MarkdownFile";
import {Transformer} from "./Transformer";

export class MarkdownFileReader extends Transformer<FileText, MarkdownFile> {
	constructor() {
		super(FileTextType, MarkdownFileType);
	}

	onInput(fileText: FileText): void {
		if (!fileText.file.fileName.endsWith(".md")) {
			return;
		}
		const frontMatter = getFrontMatter(fileText.text);
		const header = getTitle(fileText.text);
		const markdownFile: MarkdownFile = {
			fileText,
			frontMatter,
		};
		if (header != null && header.title != null && header.headingLevel != null) {
			markdownFile.firstHeading = {
				text: header.title,
				level: header.headingLevel as HeadingLevel,
			};
		}
		this.notify(markdownFile);
	}
}
