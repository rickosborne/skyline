import {SourceFile, SourceFileType} from "./SourceFile";
import {Type} from "./Type";

export interface FileText {
	file: SourceFile;
	text: string;
}

export const FileTextType = Type.novel<FileText>()
	.withTypedField("file", SourceFileType)
	.withScalarField("text", Type.isString, Type.isString, Type.strictNotEquals)
	.withStringify(item => SourceFileType.stringify(item.file))
	.withName("FileText");
