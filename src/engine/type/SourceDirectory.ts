import {OperationBase, operationBaseSubtype} from "./Operation";
import {Type} from "./Type";

export interface SourceDirectory {
	fileName: string;
	fullPath: string;
	pathFromRoot: string;
}

export const SourceDirectoryType = Type.novel<SourceDirectory>(item => item.pathFromRoot)
	.withScalarField<SourceDirectory, "fileName", string>("fileName", Type.isString)
	.withScalarField<SourceDirectory, "fullPath", string>("fullPath", Type.isString)
	.withScalarField<SourceDirectory, "pathFromRoot", string>("pathFromRoot", Type.isString)
	.withName("SourceDirectory");

export type SourceDirectoryOperation = OperationBase<SourceDirectory>;

export const SourceDirectoryOperationType: Type<SourceDirectoryOperation> = operationBaseSubtype(SourceDirectoryType)
	.withName("SourceDirectoryOperation");
