import {Type} from "../type/Type";
import {Transformer} from "./Transformer";

export interface Identifies<T> {
	readonly identifies: Type<T>;
}

export class SubtypeIdentifier<IN, OUT extends IN> extends Transformer<IN, OUT> implements Identifies<OUT> {
	public readonly identifies: Type<OUT>;

	constructor(
		inType: Type<IN>,
		outType: Type<OUT>,
	) {
		super(inType, outType);
		this.identifies = outType;
	}

	onInput(input: IN): void {
		if (this.outType?.isInstance(input)) {
			if (!this.hasChanged(input)) {
				return;
			}
			// console.debug(`[${this}] is ${this.outType}: ${this.outType?.stringify(input)}`);
			this.notify(input);
		}
	}

	toString(): string {
		return this.outType?.name + "Identifier";
	}
}
