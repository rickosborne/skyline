import {OperationBase, OperationBaseType} from "./Operation";
import {SourceFile} from "./SourceFile";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export interface SourceDirectory {
	fileName: string;
	fullPath: string;
	pathFromRoot: string;
}

export const SourceDirectoryType = Type.from("SourceDirectory", (item: any): item is SourceDirectory => item != null &&
	typeof item.fileName === "string" &&
	typeof item.fullPath === "string" &&
	typeof item.pathFromRoot === "string",
	(a, b) => a.pathFromRoot === b.pathFromRoot,
	(a, b) => a.pathFromRoot !== b.pathFromRoot || a.fullPath !== b.fullPath || a.fileName !== b.fileName,
	item => item.pathFromRoot,
);
export const SourceDirectoryOperationType = OperationBaseType.subtype("SourceDirectoryOperation", (item: any): item is OperationBase<SourceDirectory> => item != null &&
	SourceDirectoryType.isInstance(item.item),
	(a, b) => SourceDirectoryType.equals(a.item, b.item),
	(a, b) => SourceDirectoryType.hasChanged(a.item, b.item),
	item => `${item.operation}:${SourceDirectoryType.stringify(item.item)}`,
);

export interface SourceDirectoryFileList {
	fileList: SourceFile[];
	sourceDirectory: SourceDirectory;
}

export const SourceDirectoryFileListType = Type.from("SourceDirectoryFileList",
	(item: any): item is SourceDirectoryFileList => item != null &&
		Array.isArray(item.fileList) &&
		SourceDirectoryType.isInstance(item.sourceDirectory),
	(a, b) => SourceDirectoryType.equals(a.sourceDirectory, b.sourceDirectory),
	(a, b) => equal(a.fileList, b.fileList),
	item => SourceDirectoryType.stringify(item.sourceDirectory) + "#" + item.fileList.length,
);

export type SourceDirectoryFileListOperation = OperationBase<SourceDirectoryFileList>;

export const SourceDirectoryFileListOperationType = OperationBaseType.subtype("SourceDirectoryFileListOperation",
	(item: any): item is OperationBase<SourceDirectoryFileList> => item != null &&
		SourceDirectoryFileListType.isInstance(item.item),
	(a, b) => SourceDirectoryFileListType.equals(a.item, b.item),
	(a, b) => SourceDirectoryFileListType.hasChanged(a.item, b.item),
	item => `${item.operation}:${SourceDirectoryFileListType.stringify(item.item)}`,
);
