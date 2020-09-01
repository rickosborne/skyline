import {FrontMatter} from "../../template/FrontMatter";
import {FileText, FileTextType} from "./FileText";
import {OperationBase} from "./Operation";
import {SourceDirectoryFileList, SourceDirectoryFileListOperationType} from "./SourceDirectory";
import {SourceFileType} from "./SourceFile";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const FrontMatterType = Type.from("FrontMatter",
	(item: any): item is FrontMatter => item != null,
	(a, b) => {
		throw new Error(`Unexpected call to FrontMatter.equals`);
	},
	(a, b) => !equal(a, b),
	item => {
		throw new Error(`Unexpected call to FrontMatter.stringify`)
	},
);

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const HeadingLevelFromTagName: Record<string, HeadingLevel> = {
	h1: 1,
	H1: 1,
	h2: 2,
	H2: 2,
	h3: 3,
	H3: 3,
	h4: 4,
	H4: 4,
	h5: 5,
	H5: 5,
	h6: 6,
	H6: 6,
};

export interface Heading {
	level: HeadingLevel;
	text: string;
}

export const HeadingType = Type.from("Heading",
	(item: any): item is Heading => item != null && typeof item.text === "string" && typeof item.level === "number",
	(a, b) => equal(a, b),
	(a, b) => !equal(a, b),
	item => `h${item.level}. ${item.text}`,
);

export interface MarkdownFile {
	fileText: FileText;
	firstHeading?: Heading;
	frontMatter?: FrontMatter;
}

export const MarkdownFileType = Type.from("MarkdownFile",
	(item: any): item is MarkdownFile => item != null &&
		typeof item.fullText === "string" &&
		(item.firstHeading == null || HeadingType.isInstance(item.firstHeading)) &&
		SourceFileType.isInstance(item.sourceFile),
	(a, b) => FileTextType.equals(a.fileText, b.fileText),
	(a, b) => (a.firstHeading != null && b.firstHeading != null && HeadingType.hasChanged(a.firstHeading, b.firstHeading)) ||
		((a.firstHeading != null || b.firstHeading != null) && b.firstHeading !== a.firstHeading) ||
		(a.frontMatter != null && b.frontMatter != null && FrontMatterType.hasChanged(a.frontMatter, b.frontMatter)) ||
		((a.frontMatter != null || b.frontMatter != null) && a.frontMatter !== b.frontMatter) ||
		FileTextType.hasChanged(a.fileText, b.fileText),
	item => FileTextType.stringify(item.fileText),
);

export interface MarkdownFileList {
	fileListOperation: OperationBase<SourceDirectoryFileList>;
	markdownFiles: MarkdownFile[];
}

export const MarkdownFileListType = Type.from("MarkdownFileList",
	(item: any): item is MarkdownFileList => item != null &&
		SourceDirectoryFileListOperationType.isInstance(item.fileListOperation) &&
		Array.isArray(item.markdownFiles),
	(a, b) => SourceDirectoryFileListOperationType.equals(a.fileListOperation, b.fileListOperation),
	(a, b) => !equal(a.markdownFiles, b.markdownFiles),
	item => SourceDirectoryFileListOperationType.stringify(item.fileListOperation) + "#" + item.markdownFiles.length,
);
