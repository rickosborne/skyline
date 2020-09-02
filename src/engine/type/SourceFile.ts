import {OperationBase, OperationBaseType} from "./Operation";
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

export const SourceFileType = Type.from("SourceFile", (item: any): item is SourceFile => item != null &&
	SourceDirectoryType.isInstance(item.directory) &&
	typeof item.baseName === "string" &&
	typeof item.extension === "string" &&
	typeof item.fileName === "string" &&
	typeof item.fullPath === "string" &&
	typeof item.pathFromRoot === "string",
	(a, b) => a.pathFromRoot === b.pathFromRoot,
	(a, b) => a.baseName !== b.baseName || a.extension !== b.extension || a.fileName !== b.fileName || a.fullPath !== b.fullPath || a.pathFromRoot !== b.pathFromRoot || SourceDirectoryType.hasChanged(a.directory, b.directory),
	item => item.pathFromRoot,
);

export type SourceFileOperation = OperationBase<SourceFile>;

export const SourceFileOperationType = OperationBaseType.subtype("SourceFileOperation", (item: any): item is OperationBase<SourceFile> => item != null &&
	SourceFileType.isInstance(item.item),
	(a, b) => a.operation === b.operation && SourceFileType.equals(a.item, b.item),
	(a, b) => SourceFileType.hasChanged(a.item, b.item),
	item => `${item.operation}:${SourceFileType.stringify(item.item)}`,
);

export function sortFilesByName(a: SourceFile, b: SourceFile): number {
	return a.fileName.localeCompare(b.fileName);
}
