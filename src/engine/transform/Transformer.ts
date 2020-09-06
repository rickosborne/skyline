import {Logger} from "loglevel";
import {buildConfig, configureLogger, EngineConfig} from "../EngineConfig";
import {Consumer, Type} from "../type/Type";

export abstract class Publisher<T> {
	public readonly config: EngineConfig;
	private readonly listeners: Consumer<T>[] = [];
	public readonly logger: Logger;
	public readonly name: string;

	protected constructor(
		public readonly outType: Type<T> | undefined,
		config: Partial<EngineConfig> = {},
	) {
		this.name = this.constructor.name;
		this.config = buildConfig(config);
		this.logger = configureLogger(this.name, this.config);
	}

	public addListener(listener: Consumer<T>): void {
		this.listeners.push(listener);
	}

	protected notify(event: T): void {
		this.listeners.forEach(listener => listener(event));
	}

	public start(): void {
		this.logger.info("Start");
	};

	public toString(): string {
		return this.name;
	}
}

export abstract class Transformer<T, U> extends Publisher<U> {
	private readonly cache: Map<string, T> = new Map<string, T>();

	protected constructor(
		public readonly inType: Type<T> | undefined,
		outType: Type<U> | undefined,
		config: Partial<EngineConfig> = {},
	) {
		super(outType, config);
	}

	protected hasChanged(item: T): boolean {
		if (this.inType == null) {
			return true;
		}
		const id = this.inType.identify(item);
		if (id == null) {
			return true;
		}
		const existing = this.cache.get(id);
		if (existing == null) {
			this.cache.set(id, item);
		} else if (this.inType.hasChanged(existing, item)) {
			this.logger.debug(`Cache update: ${id}`)
			this.cache.set(id, item);
		} else {
			return false;
		}
		return true;
	}

	public abstract onInput(input: T): void;
}

export abstract class BiTransformer<A, B, C> extends Publisher<C> {
	private readonly lefts: Map<string, A> = new Map<string, A>();
	private readonly rights: Map<string, B> = new Map<string, B>();

	protected constructor(
		public readonly inLeftType: Type<A>,
		public readonly inRightType: Type<B>,
		outType: Type<C> | undefined,
		config: Partial<EngineConfig> = {},
	) {
		super(outType, config);
	}

	hasChanged<T>(item: T, type: Type<T>, items: Map<string, T>): boolean {
		const id = type.identify(item);
		if (id != null) {
			const existing = items.get(id);
			if (existing == null) {
				items.set(id, item);
			} else if (type.hasChanged(existing, item)) {
				this.logger.debug(`Cache update: ${id}`);
				items.set(id, item);
			} else {
				return false;
			}
		}
		return true;
	}

	protected abstract matchLeftRight(left: A, right: B): boolean;

	public onInputLeft(left: A): void {
		if (this.hasChanged(left, this.inLeftType, this.lefts)) {
			this.rights.forEach(right => {
				if (this.matchLeftRight(left, right)) {
					this.onInputs(left, right);
				}
			});
		}
	}

	public onInputRight(right: B): void {
		if (this.hasChanged(right, this.inRightType, this.rights)) {
			this.lefts.forEach(left => {
				if (this.matchLeftRight(left, right)) {
					this.onInputs(left, right);
				}
			})
		}
	}

	protected abstract onInputs(a: A, b: B): void;
}
