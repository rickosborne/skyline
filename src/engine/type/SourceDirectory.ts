import {OperationBase, operationBaseSubtype} from "./Operation";
import {Type} from "./Type";

export interface SourceDirectory {
	fileName: string;
	fullPath: string;
	pathFromRoot: string;
}

export const SourceDirectoryType = Type.novel<SourceDirectory>()
	.withScalarField("fileName", false, Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("fullPath", false, Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withScalarField("pathFromRoot", true, Type.isString, Type.strictEquals, Type.strictNotEquals)
	.withStringify(item => item.pathFromRoot)
	.withName("SourceDirectory");

export type SourceDirectoryOperation = OperationBase<SourceDirectory>;

export const SourceDirectoryOperationType: Type<SourceDirectoryOperation> = operationBaseSubtype(SourceDirectoryType)
	.withName("SourceDirectoryOperation");
