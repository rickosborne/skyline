import {Consumer, Type} from "../type/Type";

export abstract class Publisher<T> {
	private readonly listeners: Consumer<T>[] = [];

	protected constructor(
		public readonly outType: Type<T> | undefined,
	) {
	}

	public addListener(listener: Consumer<T>): void {
		this.listeners.push(listener);
	}

	protected notify(event: T): void {
		this.listeners.forEach(listener => listener(event));
	}

	public start(): void {
	};

	public toString(): string {
		return this.constructor.name;
	}
}

export abstract class Transformer<T, U> extends Publisher<U> {
	protected constructor(
		public readonly inType: Type<T> | undefined,
		outType: Type<U> | undefined,
	) {
		super(outType);
	}

	public abstract onInput(input: T): void;
}

export abstract class BiTransformer<A, B, C> extends Publisher<C> {
	private readonly lefts: A[] = [];
	private readonly rights: B[] = [];

	protected constructor(
		public readonly inLeftType: Type<A>,
		public readonly inRightType: Type<B>,
		outType: Type<C> | undefined,
	) {
		super(outType);
	}

	cache<T>(items: T[], item: T, type: Type<T>, predicate: (item: T) => boolean): boolean {
		const existingIndex = items.findIndex(predicate);
		if (existingIndex < 0) {
			items.push(item);
		} else {
			const existing = items[existingIndex];
			if (!type.hasChanged(existing, item)) {
				// same
				return false;
			}
			items.splice(existingIndex, 1, item);
		}
		return true;
	}

	protected abstract matchLeftRight(left: A, right: B): boolean;

	public onInputLeft(left: A): void {
		if (this.cache(this.lefts, left, this.inLeftType, otherA => this.inLeftType.equals(left, otherA))) {
			const matches = this.rights.filter(right => this.matchLeftRight(left, right));
			matches.forEach(right => this.onInputs(left, right));
		}
	}

	public onInputRight(right: B): void {
		if (this.cache(this.rights, right, this.inRightType, otherB => this.inRightType.equals(right, otherB))) {
			const matches = this.lefts.filter(left => this.matchLeftRight(left, right));
			matches.forEach(left => this.onInputs(left, right));
		}
	}

	protected abstract onInputs(a: A, b: B): void;
}
