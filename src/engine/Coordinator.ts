import {ifLines, uniqueReducer} from "../template/util";
import {identifiesType, isIdentifier} from "./transform/SubtypeIdentifier";
import {BiTransformer, Publisher, Transformer} from "./transform/Transformer";
import {Consumer, Type} from "./type/Type";
import * as fs from 'fs';
import * as path from 'path';
import {ROOT_PATH} from "./util/RootPath";

export class Bridge<T> {
	private readonly cache: T[] = [];

	protected constructor(
		public readonly type: Type<T>,
		public readonly source: Publisher<T>,
		public readonly sink: Consumer<T>,
		public readonly sinkName: string,
	) {
	}

	public onItem(item: T): void {
		const existingIndex = this.cache.findIndex(cached => this.type.equals(cached, item));
		if (existingIndex < 0) {
			// console.debug(`[${this.source}:${this.type}:${this.sinkName}] New: ${this.type.stringify(item)}`);
			this.cache.push(item);
		} else {
			const existing = this.cache[existingIndex];
			if (!this.type.hasChanged(existing, item)) {
				// console.debug(`[${this.source}:${this.type}:${this.sinkName}] No change: ${this.type.stringify(item)}`);
				return;
			}
			// console.debug(`[${this.source}:${this.type}:${this.sinkName}] Updated: ${this.type.stringify(item)}`);
			this.cache.splice(existingIndex, 1, item);
		}
		this.sink(item);
	}

	public static ofType<T>(
		type: Type<T>,
		source: Publisher<T>,
		sink: Consumer<T>,
		sinkName: string,
	): Bridge<T> {
		const bridge = new Bridge(type, source, sink, sinkName);
		source.addListener(bridge.onItem.bind(bridge));
		return bridge;
	}
}

export class Coordinator {
	private readonly bitransformers: BiTransformer<any, any, any>[] = [];
	private readonly transformers: Transformer<any, any>[] = [];

	public add(transformer: Transformer<any, any>): this {
		this.transformers.push(transformer);
		return this;
	}

	public addBi(bitransformer: BiTransformer<any, any, any>): this {
		this.bitransformers.push(bitransformer);
		return this;
	}

	protected linkTo<T>(name: string, inType: Type<T>, sinkName: string, sink: (input: T) => void, noOutput: Set<Publisher<any>>, gotInput: () => void): void {
		this.transformers.filter(t => inType.isAssignableFrom(t.outType)).forEach(source => {
			gotInput();
			noOutput.delete(source);
			console.info(`Pipe: (${inType.name}) ${source} => ${name}`);
			Bridge.ofType(inType, source, sink, sinkName);
		});
		this.bitransformers.filter(t => inType.isAssignableFrom(t.outType)).forEach(source => {
			gotInput();
			noOutput.delete(source);
			console.info(`Pipe: (${inType.name}) ${source} => ${name}`);
			Bridge.ofType(inType, source, sink, sinkName);
		});
	}

	private ensureEmpty<T>(items: Set<T>, messageBuilder: (item: T) => string): boolean {
		if (items.size === 0) {
			return false;
		}
		items.forEach(item => console.error(messageBuilder(item)));
		return true;
	}

	public toPlantUml(): string {
		const style = fs.readFileSync(path.join(ROOT_PATH, "assets", "puml", "skyline-style.puml"), {encoding: 'utf8'});
		const typeName = (type: Type<any> | undefined): string => type == null ? "" : type.name.replace(/\W+/g, '');
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
		const subtypes = types.reduce((m, t) => {
			let s = m.get(t);
			if (s == null) {
				s = new Set<Type<any>>();
				m.set(t, s);
			}
			s.add(t);
			if (t.parent != null) {
				s = m.get(t.parent);
				if (s == null) {
					s = new Set<Type<any>>();
					m.set(t.parent, s);
				}
				s.add(t);
			}
			return m;
		}, new Map<Type<any>, Set<Type<any>>>());
		const subtypesOf = (t: Type<any>, identifies: Type<any> | undefined): Type<any>[] => {
			return identifies != null ? [t] : [t].concat(...t.subtypes);
		};
		return ifLines([
			"@startuml",
			"title Development Data Pipeline",
			" ",
			style.split(/\n+/g),
			" ",
			this.transformers.sort(sortPublishers).map(t => `rectangle ${t}`),
			this.bitransformers.sort(sortPublishers).map(t => `rectangle ${t}`),
			types.map(t => `entity "${t}" as ${typeName(t)}`),
			types.filter(t => t.parent != null).map(t => `${typeName(t.parent)} <.. ${typeName(t)} : extends`),
			this.transformers.sort(sortPublishers).flatMap(t => [
				t.inType == null ? "" : Array.from(subtypesOf(t.inType, identifiesType(t))).map(type => `${typeName(type)} --> ${t}`).join("\n"),
				t.outType == null ? "" : `${t} --> ${typeName(t.outType)}`,
			]),
			this.bitransformers.sort(sortPublishers).flatMap(t => [
				t.inLeftType == null ? "" : Array.from(subtypesOf(t.inLeftType, undefined)).map(type => `${typeName(type)} --> ${t}`).join("\n"),
				t.inRightType == null ? "" : Array.from(subtypesOf(t.inRightType, undefined)).map(type => `${typeName(type)} --> ${t}`).join("\n"),
				t.outType == null ? "" : `${t} --> ${typeName(t.outType)}`,
			]),
			"@enduml",
		]);
	}

	public start(): void {
		const uml = this.toPlantUml();
		fs.writeFile(path.join(ROOT_PATH, "assets", "puml", "dev-data-pipeline.puml"), uml, {encoding: 'utf8'}, (err) => {
			if (err) {
				throw err;
			}
		});
		const noInput = new Set<Transformer<any, any>>();
		const noLeftInput = new Set<BiTransformer<any, any, any>>();
		const noRightInput = new Set<BiTransformer<any, any, any>>();
		const noOutput = new Set<Publisher<any>>();
		for (let sink of this.transformers) {
			if (sink.inType == null) {
				noInput.delete(sink);
			} else {
				this.linkTo(sink.toString(), sink.inType, sink.toString(), sink.onInput.bind(sink), noOutput, () => noInput.delete(sink));
			}
			if (sink.outType == null) {
				noOutput.delete(sink);
			}
		}
		for (let sink of this.bitransformers) {
			this.linkTo(sink.toString(), sink.inLeftType, sink.toString() + ":L", sink.onInputLeft.bind(sink), noOutput, () => noLeftInput.delete(sink));
			this.linkTo(sink.toString(), sink.inRightType, sink.toString() + ":R", sink.onInputRight.bind(sink), noOutput, () => noRightInput.delete(sink));
			if (sink.outType == null) {
				noOutput.delete(sink);
			}
		}
		let problems = this.ensureEmpty(noInput, t => `No sources found for ${t.inType?.name}: ${t}`) ||
			this.ensureEmpty(noLeftInput, t => `No sources found for ${t.inLeftType.name}: ${t}`) ||
			this.ensureEmpty(noRightInput, t => `No source found for ${t.inRightType.name}: ${t}`) ||
			this.ensureEmpty(noOutput, t => `No sinks found for ${t.outType?.name}: ${t}`)
		;
		if (problems) {
			throw new Error(`Fix your data pipeline.`);
		}
		this.transformers.forEach(transformer => transformer.start());
		this.bitransformers.forEach(bitransformer => bitransformer.start());
	}
}
