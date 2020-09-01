import {SourceFile, SourceFileType} from "./SourceFile";
import {Type} from "./Type";

export interface FileText {
	file: SourceFile;
	text: string;
}

export const FileTextType = Type.from("FileText", (item: any): item is FileText => item != null &&
	typeof item.text === "string" &&
	SourceFileType.isInstance(item.file),
	(a, b) => SourceFileType.equals(a.file, b.file),
	(a, b) => a.text !== b.text || SourceFileType.hasChanged(a.file, b.file),
	item => SourceFileType.stringify(item.file),
);
