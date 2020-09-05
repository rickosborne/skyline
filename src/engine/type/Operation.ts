import {Type, TypeBuilder} from "./Type";

export enum Operation {
	Replay = "Replay",
	Created = "Created",
	Updated = "Updated",
	Deleted = "Deleted",
	Renamed = "Renamed",
}

export interface HasOperation {
	operation: Operation;
}

export interface OperationBase<T> extends HasOperation {
	item: T;
}

export type ReplayItem<T> = OperationBase<T> & { operation: Operation.Replay; };
export type CreatedItem<T> = OperationBase<T> & { operation: Operation.Created; };
export type UpdatedItem<T> = OperationBase<T> & { operation: Operation.Updated; };
export type DeletedItem<T> = OperationBase<T> & { operation: Operation.Deleted; };
export type RenamedItem<T> = OperationBase<T> & { operation: Operation.Renamed; before: T; };
export const isReplay = <T>(op: OperationBase<T>): op is ReplayItem<T> => op.operation === Operation.Replay;
export const isCreated = <T>(op: OperationBase<T>): op is CreatedItem<T> => op.operation === Operation.Created;
export const isUpdated = <T>(op: OperationBase<T>): op is UpdatedItem<T> => op.operation === Operation.Updated;
export const isDeleted = <T>(op: OperationBase<T>): op is DeletedItem<T> => op.operation === Operation.Deleted;
export const isRenamed = <T>(op: OperationBase<T>): op is RenamedItem<T> => op.operation === Operation.Renamed;

export const HasOperationType = Type.novel<HasOperation>()
	.withScalarField("operation", true, (op: any): op is Operation => Type.isString(op), (a, b) => a === b, Type.strictNotEquals)
	.withStringify(item => item.operation)
	.withName("HasOperation");

export const operationBaseSubtype = <O extends OperationBase<T>, T>(type: Type<T>): TypeBuilder<O, {item: T}> => HasOperationType.toBuilder<O>()
	.withTypedField("item", type);
