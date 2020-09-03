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

export const SourceFileType = Type.novel<SourceFile>(item => item.pathFromRoot)
	.withScalarField<SourceFile, "fileName", string>("fileName", Type.isString)
	.withScalarField<SourceFile, "extension", string>("extension", Type.isString)
	.withScalarField<SourceFile, "baseName", string>("baseName", Type.isString)
	.withScalarField<SourceFile, "fullPath", string>("fullPath", Type.isString)
	.withScalarField<SourceFile, "pathFromRoot", string>("pathFromRoot", Type.isString)
	.withTypedField<SourceFile, "directory", SourceDirectory>("directory", SourceDirectoryType)
	.withName<SourceFile>("SourceFile");

export type SourceFileOperation = OperationBase<SourceFile>;

export const SourceFileOperationType = operationBaseSubtype(SourceDirectoryType)
	.withName<SourceFileOperation>("SourceFileOperation");

export function sortFilesByName(a: SourceFile, b: SourceFile): number {
	return a.fileName.localeCompare(b.fileName);
}

export interface SourceDirectoryFileList {
	fileList: SourceFile[];
	sourceDirectory: SourceDirectory;
}

export const SourceDirectoryFileListType = Type.novel<SourceDirectoryFileList>(item => SourceDirectoryType.stringify(item.sourceDirectory))
	.withTypedList<SourceDirectoryFileList, "fileList", SourceFile>("fileList", SourceFileType)
	.withTypedField<SourceDirectoryFileList, "sourceDirectory", SourceDirectory>("sourceDirectory", SourceDirectoryType)
	.withName("SourceDirectoryFileList");

export type SourceDirectoryFileListOperation = OperationBase<SourceDirectoryFileList>;

export const SourceDirectoryFileListOperationType: Type<SourceDirectoryFileListOperation> = operationBaseSubtype(SourceDirectoryFileListType)
	.withName("SourceDirectoryFileListOperation");
