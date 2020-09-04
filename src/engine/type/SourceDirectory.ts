import {OperationBase, operationBaseSubtype} from "./Operation";
import {Type} from "./Type";

export interface SourceDirectory {
	fileName: string;
	fullPath: string;
	pathFromRoot: string;
}

export const SourceDirectoryType = Type.novel<SourceDirectory>()
	.withScalarField("fileName", Type.isString)
	.withScalarField("fullPath", Type.isString)
	.withScalarField("pathFromRoot", Type.isString)
	.withStringify(item => item.pathFromRoot)
	.withName("SourceDirectory");

export type SourceDirectoryOperation = OperationBase<SourceDirectory>;

export const SourceDirectoryOperationType: Type<SourceDirectoryOperation> = operationBaseSubtype(SourceDirectoryType)
	.withName("SourceDirectoryOperation");
