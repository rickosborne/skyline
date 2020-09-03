import {FrontMatter} from "../../template/FrontMatter";
import {FileText, FileTextType} from "./FileText";
import {SourceDirectoryFileListOperation, SourceDirectoryFileListOperationType} from "./SourceFile";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const FrontMatterType = Type.from("FrontMatter",
	(item: any): item is FrontMatter => item != null,
	() => {
		throw new Error(`Unexpected call to FrontMatter.equals`);
	},
	(a, b) => !equal(a, b),
	() => {
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

export const HeadingType = Type.novel<Heading>(h => `h${h.level}. ${h.text}`)
	.withScalarField<Heading, "level", HeadingLevel>("level", (level: any): level is HeadingLevel => Type.isNumber(level))
	.withScalarField<Heading, "text", string>("text", Type.isString)
	.withName("Heading");

export interface MarkdownFile {
	fileText: FileText;
	firstHeading?: Heading;
	frontMatter?: FrontMatter;
}

export const MarkdownFileType = FileTextType.toBuilder()
	.wrappedAs<MarkdownFile, "fileText">("fileText")
	.withOptionalTypedField<MarkdownFile, "firstHeading", Heading>("firstHeading", HeadingType)
	.withOptionalTypedField<MarkdownFile, "frontMatter", FrontMatter>("frontMatter", FrontMatterType, false)
	.withName("MarkdownFile")
;

export interface MarkdownFileList {
	fileListOperation: SourceDirectoryFileListOperation;
	markdownFiles: MarkdownFile[];
}

export const MarkdownFileListType: Type<MarkdownFileList> = SourceDirectoryFileListOperationType.toBuilder()
	.wrappedAs<MarkdownFileList, "fileListOperation">("fileListOperation")
	.withTypedList<MarkdownFileList, "markdownFiles", MarkdownFile>("markdownFiles", MarkdownFileType)
	.withName("MarkdownFileList");
