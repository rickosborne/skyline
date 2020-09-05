import {EngineConfig} from "../EngineConfig";
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
		config: Partial<EngineConfig> = {},
	) {
		super(inType, outType, config);
		this.identifies = outType;
	}

	onInput(input: IN): void {
		if (this.identifies.isInstance(input)) {
			if (!this.hasChanged(input)) {
				return;
			}
			this.logger.debug(`is ${this.outType}: ${this.identifies.stringify(input)}`);
			this.notify(input);
		}
	}

	toString(): string {
		return this.identifies.name + "Identifier";
	}
}
