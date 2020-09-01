import {Type} from "./Type";

export enum Operation {
  Replay = "Replay",
  Created = "Created",
  Updated = "Updated",
  Deleted = "Deleted",
  Renamed = "Renamed",
}

export interface OperationBase<T> {
  item: T;
  operation: Operation;
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
export const OperationBaseType = Type.from("OperationBase", (item: any): item is OperationBase<any> => item != null &&
	item.operation != null &&
	"item" in item,
	(a, b) => a.operation == b.operation,
	(a, b) => a.operation !== b.operation,
	() => {throw new Error(`Cannot stringify unparameterized OperationBase`)},
);
