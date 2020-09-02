import {Type} from "../type/Type";
import {Transformer} from "./Transformer";

export interface Identifies<T> {
	readonly identifies: Type<T>;
}

export const isIdentifier = (item: any): item is Identifies<any> => item != null && item.identifies != null;
export const identifiesType = (item: any): Type<any> | undefined => isIdentifier(item) ? item.identifies : undefined;

export class SubtypeIdentifier<IN, OUT extends IN> extends Transformer<IN, OUT> implements Identifies<OUT> {
	public readonly identifies: Type<OUT>;

	constructor(
		public readonly inType: Type<IN>,
		public readonly outType: Type<OUT>,
	) {
		super(inType, outType);
		this.identifies = outType;
	}

	onInput(input: IN): void {
		if (this.outType.isInstance(input)) {
			this.notify(input);
		}
	}

	toString(): string {
		return this.outType.name + "Identifier";
	}
}
