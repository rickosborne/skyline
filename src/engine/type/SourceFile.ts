import {OperationBase, operationBaseSubtype} from "./Operation";
import {SourceDirectory, SourceDirectoryType} from "./SourceDirectory";
import {Type} from "./Type";

export interface SourceFile {
	baseName: string;
	directory: SourceDirectory;
	extension: string;
	fileName: string;
	fullPath: string;
	pathFromRoot: string;
}

export const SourceFileType = Type.novel<SourceFile>()
	.withScalarField("fileName", Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("extension", Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("baseName", Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("fullPath", Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("pathFromRoot", Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withTypedField("directory", SourceDirectoryType)
	.withStringify(item => item.pathFromRoot)
	.withName("SourceFile");

export type SourceFileOperation = OperationBase<SourceFile>;

export const SourceFileOperationType = operationBaseSubtype<SourceFileOperation, SourceFile>(SourceFileType)
	.withName("SourceFileOperation");

export function sortFilesByName(a: SourceFile, b: SourceFile): number {
	return a.fileName.localeCompare(b.fileName);
}

export interface SourceDirectoryFileList {
	fileList: SourceFile[];
	sourceDirectory: SourceDirectory;
}

export const SourceDirectoryFileListType = Type.novel<SourceDirectoryFileList>()
	.withTypedList("fileList", SourceFileType)
	.withTypedField("sourceDirectory", SourceDirectoryType)
	.withStringify(item => SourceDirectoryType.stringify(item.sourceDirectory))
	.withName("SourceDirectoryFileList");

export type SourceDirectoryFileListOperation = OperationBase<SourceDirectoryFileList>;

export const SourceDirectoryFileListOperationType: Type<SourceDirectoryFileListOperation> = operationBaseSubtype(SourceDirectoryFileListType)
	.withName("SourceDirectoryFileListOperation");
