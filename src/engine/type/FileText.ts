import {SourceFile, SourceFileType} from "./SourceFile";
import {Type} from "./Type";

export interface FileText {
	file: SourceFile;
	text: string;
}

export const FileTextType: Type<FileText> = SourceFileType.toBuilder()
	.wrappedAs<FileText, "file">("file")
	.withScalarField<FileText, "text", string>("text", Type.isString)
	.withName("FileText");
