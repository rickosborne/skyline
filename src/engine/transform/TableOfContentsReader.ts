import {State} from "../../template/FrontMatter";
import {matchCount} from "../../template/util";
import {MarkdownFile, MarkdownFileList, MarkdownFileListType} from "../type/MarkdownFile";
import {SourceFile} from "../type/SourceFile";
import {MarkdownContentItem, TableOfContentsItems, TableOfContentsItemsType} from "../type/TableOfContents";
import {Transformer} from "./Transformer";

export class TableOfContentsReader extends Transformer<MarkdownFileList, TableOfContentsItems> {
	constructor() {
		super(MarkdownFileListType, TableOfContentsItemsType);
	}

	protected indentLevel(markdownFile: MarkdownFile): number {
		let fromTitle = markdownFile.firstHeading?.level || 1;
		if (markdownFile.frontMatter?.state === State.Start) {
			return 1;
		} else if (fromTitle === 1 && markdownFile.frontMatter?.tags?.includes("full-width")) {
			return fromTitle + 1;
		}
		return fromTitle;
	}

	protected isPrintable(sourceFile: SourceFile): boolean {
		return !!sourceFile.fileName.match(/^\d+-/);
	}

	onInput(markdownFileList: MarkdownFileList): void {
		const contentItems: MarkdownContentItem[] = markdownFileList.markdownFiles
			.filter(markdownFile => this.isPrintable(markdownFile.fileText.file))
			.map(markdownFile => ({
				markdownFile,
				title: markdownFile.firstHeading?.text || markdownFile.frontMatter?.title || "TODO",
				description: markdownFile.frontMatter?.description,
				indentLevel: this.indentLevel(markdownFile),
				link: markdownFile.fileText.file.fileName,
				notStarted: markdownFile.frontMatter?.tags?.includes("not-started") || false,
				titleIsSpoiler: markdownFile.frontMatter?.tags?.includes("title-is-spoiler") || false,
				startOfStory: markdownFile.frontMatter?.state === State.Start,
				todoCount: matchCount(markdownFile.fileText.text, /\bTODO\b/),
			}));
		if (contentItems.length > 0) {
			this.notify({
				markdownFileList,
				contentItems: contentItems as MarkdownContentItem[],
			});
		}
	}
}
