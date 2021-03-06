import * as fs from "fs";
import {Logger} from "loglevel";
import * as path from "path";
import {ifLines, uniqueReducer} from "../template/util";
import {buildConfig, configFromEnvironment, configureLogger, EngineConfig} from "./EngineConfig";
import {BiTransformer, Publisher, Transformer} from "./transform/Transformer";
import {Consumer, Type, UniConstructor, UniFunction} from "./type/Type";
import {ROOT_PATH} from "./util/RootPath";

const typeName = (type: Type<any> | undefined): string => type == null ? "" : type.name.replace(/\W+/g, "");

export type InTransform<I> = Transformer<I, any> | BiTransformer<I, any, any> | BiTransformer<any, I, any>;

export class Bridge<O extends I, I, BT extends InTransform<I>> {
	private readonly cache: Map<string, I> = new Map<string, I>();

	protected constructor(
		public readonly outType: Type<O>,
		public readonly inType: Type<I>,
		public readonly source: Publisher<O>,
		public readonly sink: InTransform<I>,
		public readonly consumer: Consumer<I>,
	) {
	}

	public static ofType<O extends I, I, BT extends InTransform<I>>(
		outType: Type<O>,
		inType: Type<I>,
		source: Publisher<O>,
		sink: BT,
		sinkSelector: (sink: BT) => Consumer<I>,
	): Bridge<O, I, BT> {
		const consumer = sinkSelector(sink).bind(sink);
		const bridge = new Bridge(outType, inType, source, sink, consumer);
		const listenerFactory = new Function("sink", `return function to${sink.toString().replace(/[^a-z]+/ig, "")}(input) { return sink(input); }`);
		const listener = listenerFactory(consumer);
		source.addListener(listener);
		return bridge;
	}

	public onItem(item: I): void {
		const id = this.inType.identify(item);
		if (id != null) {
			const existing = this.cache.get(id);
			if (existing == null) {
				this.cache.set(id, item);
			} else if (this.inType.hasChanged(existing, item)) {
				this.cache.set(id, item);
			} else {
				return;
			}
		}
		this.consumer(item);
	}

	toPlantUmlArrow(): string[] {
		return [
			`${this.source} --> ${typeName(this.outType)}`,
			`${typeName(this.inType)} --> ${this.sink}`,
			this.inType != this.outType ? `${typeName(this.outType)} --> ${this.sink}` : ""
			// `${this.source} --> ${this.sink} : ${this.outType}`
		].filter(l => l.length > 0);
	}
}

export class Coordinator {
	private readonly bitransformers: BiTransformer<any, any, any>[] = [];
	private readonly bridges: Bridge<any, any, any>[] = [];
	public readonly effectiveConfig: EngineConfig;
	public readonly logger: Logger;
	public readonly name: string = this.constructor.name;
	private readonly transformers: Transformer<any, any>[] = [];

	constructor(
		public readonly suppliedConfig: Partial<EngineConfig> = configFromEnvironment(),
	) {
		this.effectiveConfig = buildConfig(suppliedConfig);
		this.logger = configureLogger(this.constructor.name, this.effectiveConfig);
	}

	public add(transformer: Transformer<any, any>): this {
		this.transformers.forEach(other => {
			this.bridgeOne(transformer, other, t => t.inType, t => t.outType, t => t.onInput);
			this.bridgeOne(other, transformer, t => t.inType, t => t.outType, t => t.onInput);
		});
		this.bitransformers.forEach(other => {
			this.bridgeOne(transformer, other, t => t.inType, t => t.outType, t => t.onInput);
			this.bridgeOne(other, transformer, t => t.inLeftType, t => t.outType, t => t.onInputLeft);
			this.bridgeOne(other, transformer, t => t.inRightType, t => t.outType, t => t.onInputRight);
		});
		this.transformers.push(transformer);
		return this;
	}

	public addBi(bitransformer: BiTransformer<any, any, any>): this {
		this.transformers.forEach(other => {
			this.bridgeOne(other, bitransformer, t => t.inType, t => t.outType, t => t.onInput);
			this.bridgeOne(bitransformer, other, t => t.inLeftType, t => t.outType, t => t.onInputLeft);
			this.bridgeOne(bitransformer, other, t => t.inRightType, t => t.outType, t => t.onInputRight);
		});
		this.bitransformers.forEach(other => {
			this.bridgeOne(bitransformer, other, t => t.inLeftType, t => t.outType, t => t.onInputLeft);
			this.bridgeOne(bitransformer, other, t => t.inRightType, t => t.outType, t => t.onInputRight);
			this.bridgeOne(other, bitransformer, t => t.inLeftType, t => t.outType, t => t.onInputLeft);
			this.bridgeOne(other, bitransformer, t => t.inRightType, t => t.outType, t => t.onInputRight);
		});
		this.bitransformers.push(bitransformer);
		return this;
	}

	public addPublisher(publisher: Publisher<any>): this {
		if (publisher instanceof Transformer) {
			return this.add(publisher);
		} else if (publisher instanceof BiTransformer) {
			return this.addBi(publisher);
		}
		throw new Error(`Unexpected publisher type: ${publisher.constructor.name}`);
	}

	private bridgeOne<T extends Transformer<any, any> | BiTransformer<any, any, any>>(
		consumerTransformer: T,
		publisherTransformer: Publisher<any>,
		inTypeMapper: (transformer: T) => Type<any> | undefined,
		outTypeMapper: (publisher: Publisher<any>) => Type<any> | undefined,
		consumerMapper: (transformer: T) => Consumer<any>,
	) {
		const inType = inTypeMapper(consumerTransformer);
		const outType = outTypeMapper(publisherTransformer);
		if (publisherTransformer instanceof Transformer && publisherTransformer.inType === inType) {
			return;
		}
		if (inType != null && outType != null && inType.isAssignableFrom(outType)) {
			this.logger.debug(`Bridge (${outType}) ${publisherTransformer} => ${consumerTransformer} (${inType})`)
			this.bridges.push(Bridge.ofType(outType, inType, publisherTransformer, consumerTransformer, consumerMapper));
		}
	}

	public buildAndAdd(ctor: UniConstructor<Partial<EngineConfig>, Publisher<any>>, ...ctorArgs: any[]): this {
		return this.addPublisher(new ctor(this.suppliedConfig, ...ctorArgs));
	}

	public configureAndAdd(configurer: UniFunction<Partial<EngineConfig>, Publisher<any>>): this {
		return this.addPublisher(configurer(this.suppliedConfig));
	}

	public start(): void {
		const uml = this.toPlantUml();
		fs.writeFile(path.join(ROOT_PATH, "assets", "puml", "dev-data-pipeline.puml"), uml, {encoding: "utf8"}, (err) => {
			if (err) {
				throw err;
			}
		});
		this.transformers.forEach(transformer => transformer.start());
		this.bitransformers.forEach(bitransformer => bitransformer.start());
		this.logger.info("Started");
	}

	public toPlantUml(): string {
		const style = fs.readFileSync(path.join(ROOT_PATH, "assets", "puml", "skyline-style.puml"), {encoding: "utf8"});
		const types = Object.values((this.transformers.flatMap(t => [t.inType, t.outType])).concat(this.bitransformers.flatMap(t => [t.inLeftType, t.inRightType, t.outType]))
			.reduce((types, type) => {
				if (type != null) {
					types[type.name] = type;
				}
				return types;
			}, {} as Record<string, Type<any>>))
			.flatMap(t => t.lineage)
			.reduce(uniqueReducer(), [])
			.sort((a, b) => a.name.localeCompare(b.name))
		;
		const sortPublishers: (a: Publisher<any>, b: Publisher<any>) => number = (a, b) => a.toString().localeCompare(b.toString());
		return ifLines([
			"@startuml",
			"title Development Data Pipeline",
			" ",
			style.split(/\n+/g),
			" ",
			this.transformers.sort(sortPublishers).map(t => `rectangle ${t}`),
			this.bitransformers.sort(sortPublishers).map(t => `rectangle ${t}`),
			types.map(t => `entity "${t}" as ${typeName(t)}`),
			types.filter(t => t.parent != null).map(t => `${typeName(t.parent)} <.. ${typeName(t)}`),
			this.bridges.flatMap(bridge => bridge.toPlantUmlArrow()).reduce(uniqueReducer(), []).sort(),
			"@enduml",
		]);
	}

	public toString() {
		return this.name;
	}
}
