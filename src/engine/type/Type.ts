import equal = require("fast-deep-equal");
import * as diff from "diff";
import {Logger} from "loglevel";
import {buildConfig, configFromEnvironment, configureLogger} from "../EngineConfig";

export type Consumer<T> = (item: T) => void;
export type UniFunction<T, U> = (value: T) => U;
export type BiFunction<T, U, V> = (t: T, u: U) => V;
export type BiConsumer<T, U> = (item: T, value: U) => void;
export type IsInstance<T> = (item: any) => item is T;
export type Comparator<T> = (a: T, b: T) => boolean;
export type Stringifier<T> = (item: T) => string;
export type ArrayField<T, K extends string & keyof T> = T[K] extends Array<infer V> ? V : never;
export type ArrayItem<T> = T extends (infer I)[] ? I : T extends undefined ? undefined : never;

export type Constructor<T> = {
	new(...args: any[]): T;
}

export type UniConstructor<A, T> = {
	new(arg: A, ...args: any[]): T;
}

export type Override<Type, Key extends keyof Type, Value extends Type[Key]> = {
	[Prop in Key]: Value;
};

const config = buildConfig(configFromEnvironment());

export abstract class Diff<T> {
	protected constructor(
		public readonly name: string,
		public readonly before: T | undefined,
		public readonly after: T | undefined,
	) {
	}

	hasChanged(): boolean {
		return !equal(this.before, this.after);
	}

	toString(): string {
		if (this.before == null) {
			return this.after == null ? "<both null>" : "<null> => <new>";
		} else if (this.after == null) {
			return "<deleted> => <null>";
		} else if (typeof this.before === "string" && typeof this.after === "string") {
			return `${this.name}Δ\n` + diff.diffLines(this.before, this.after, {newlineIsToken: true}).filter(change => change.added || change.removed).map(change => `${change.added ? "+" : change.removed ? "-" : " "}${change.value.replace(/\n/g, change.added ? "\n+" : change.removed ? "\n-" : "\n ")}`).join("\n");
		} else {
			return `${this.name}Δ${JSON.stringify(this.before).substr(0, 20)} => ${JSON.stringify(this.after).substr(0, 20)}`;
		}
	}
}

export class RefDiff<V> extends Diff<V> {
	public constructor(
		name: string,
		public readonly type: Type<V>,
		public readonly beforeId: string | undefined,
		public readonly afterId: string | undefined,
		before: V | undefined,
		after: V | undefined,
	) {
		super(name, before, after);
	}

	hasChanged(): boolean {
		return true;
	}

	toString(): string {
		return `${this.name}(${this.type.name}) idΔ: ${this.beforeId || "<null>"} => ${this.afterId || "<null>"}`;
	}
}

export class TypeDiff<T> extends Diff<T> {
	constructor(
		public readonly type: Type<T>,
		before: T | undefined,
		after: T | undefined,
		public readonly fieldDiffs: Diff<any>[] = [],
		name: string = type.name,
	) {
		super(name, before, after);
	}

	public static forType<T>(type: Type<T>, before: T | undefined, after: T | undefined): TypeDiff<T> {
		return new TypeDiff<T>(
			type,
			before,
			after,
			type.fields.map(field => TypeFieldDiff.forTypeField(type, field, before, after)).filter(tfd => tfd.hasChanged()),
		);
	}

	hasChanged(): boolean {
		return this.fieldDiffs.length > 0;
	}

	toString(): string {
		return `${this.name}Δ[${this.fieldDiffs.map(fd => fd.name).join(", ")}]`;
	}
}

export class TypeFieldDiff<T, V> extends Diff<V> {
	constructor(
		public readonly parentType: Type<T>,
		public readonly field: TypeField<T, V>,
		before: V | undefined,
		after: V | undefined,
		public readonly changed: boolean = true,
	) {
		super(field.name, before, after);
	}

	static forTypeField<T, V>(type: Type<T>, field: TypeField<T, V>, before: T, after: T): Diff<V> {
		const beforeValue = before == null ? undefined : field.accessor(before);
		const afterValue = after == null ? undefined : field.accessor(after);
		if (field.valueType != null) {
			return TypeDiff.forType(field.valueType, beforeValue, afterValue);
		} else if (field.itemType != null) {
			return TypedArrayDiff.forArrays<V>(field.name, field.itemType as Type<V>, beforeValue as undefined, afterValue as undefined) as Diff<V>;
		}
		let hasChanged: boolean;
		if (beforeValue == null || afterValue == null) {
			hasChanged = beforeValue !== afterValue;
		} else if (field.hasChanged != null) {
			hasChanged = field.hasChanged(beforeValue, afterValue);
		} else {
			hasChanged = !equal(beforeValue, afterValue);
		}
		return new TypeFieldDiff<T, V>(
			type,
			field,
			beforeValue,
			afterValue,
			hasChanged,
		);
	}

	hasChanged(): boolean {
		return this.changed;
	}

	toString(): string {
		if (this.field.stringify == null) {
			return `${this.name}: ${super.toString()}`;
		}
		return `${this.name}: ${this.before == null ? "<null>" : this.field.stringify(this.before)} => ${this.after == null ? "<null>" : this.field.stringify(this.after)}`;
	}
}

export class TypedArrayDiff<V> extends Diff<V[]> {
	constructor(
		name: string,
		public readonly type: Type<V>,
		before: V[] | undefined,
		after: V[] | undefined,
		public readonly changed: Diff<V>[],
	) {
		super(name, before, after);
	}

	public static forArrays<I>(name: string, type: Type<I>, before: I[] | undefined, after: I[] | undefined): TypedArrayDiff<I> {
		let changed: Diff<I>[];
		if (before == null) {
			changed = after == null ? [] : after.map(item => TypeDiff.forType(type, undefined, item));
		} else if (after == null) {
			changed = before.map(item => TypeDiff.forType(type, item, undefined));
		} else {
			changed = before.map((b, index) => {
				const a = after[index];
				const beforeId = type.identify(b);
				const afterId = type.identify(a);
				if (afterId === beforeId) {
					return TypeDiff.forType(type, b, after[index]);
				} else {
					return new RefDiff<I>(name, type, beforeId, afterId, b, a);
				}
			});
		}
		return new TypedArrayDiff<I>(
			name,
			type,
			before,
			after,
			changed.filter(d => d.hasChanged()),
		);
	}

	hasChanged(): boolean {
		return this.changed.length > 0;
	}

	toString(): string {
		return `${this.name}[]Δ[${this.changed.map(c => c.toString()).join(", ")}]`;
	}
}

export class TypeField<T, V> {
	constructor(
		public readonly name: string,
		public readonly partOfId: boolean,
		public readonly accessor: (item: T) => V,
		public readonly optional: boolean = false,
		public readonly fixedValue?: V,
		public readonly isInstance?: IsInstance<V>,
		public readonly hasChanged?: Comparator<V>,
		public readonly stringify?: Stringifier<V>,
		public readonly valueType?: Type<V>,
		public readonly isArray: boolean = false,
		public readonly itemType?: Type<V extends (infer I)[] ? I : never>,
		public readonly identifier?: (value: V) => string | undefined,
	) {
	}

	public static build<T, V>(
		name: string,
		partOfId: boolean,
		accessor: (item: T) => V,
		optional: boolean = false,
		fixedValue?: V,
		isInstance?: IsInstance<V>,
		hasChanged?: Comparator<V>,
		stringify?: Stringifier<V>,
		valueType?: Type<V>,
		isArray: boolean = false,
		itemType?: Type<V extends (infer I)[] ? I : never>,
		identifier?: (item: V) => string | undefined,
	): TypeField<T, V> {
		return new Function("TypeField", "name", "partOfId", "accessor", "optional", "fixedValue", "isInstance", "hasChanged", "stringify", "valueType", "isArray", "itemType", "identifier", `
		class ${name} extends TypeField {
			constructor(name, partOfId, accessor, optional, fixedValue, isInstance, hasChanged, stringify, valueType, isArray, itemType, identifier) {
				super(name, partOfId, accessor, optional, fixedValue, isInstance, hasChanged, stringify, valueType, isArray, itemType, identifier);
			}
		}
		return new ${name}(name, partOfId, accessor, optional, fixedValue, isInstance, hasChanged, stringify, valueType, isArray, itemType, identifier);
		`)(TypeField, name, partOfId, accessor, optional, fixedValue, isInstance, hasChanged, stringify, valueType, isArray, itemType, identifier);
	}

	public getValues(...items: T[]): V[] {
		return items.map(item => this.accessor(item));
	}

	public parentIdentify(item: T): string | undefined {
		if (!this.partOfId) {
			return undefined;
		}
		const value = this.accessor(item);
		if (this.identifier != null) {
			return this.identifier(value);
		} else if (this.valueType != null) {
			return this.valueType.identify(value);
		} else if (this.itemType != null) {
			throw new Error(`[${this.name}] Should not be trying to identify an array: ${this.itemType.name}`);
		} else if (this.stringify != null) {
			return this.stringify(value);
		} else if (typeof value === "number" || typeof value === "boolean") {
			return String(value);
		} else if (typeof value === "string") {
			return value;
		} else {
			throw new Error(`[${this.name}] Cannot identify.`);
		}
	}

	public parentIsInstance(item: any): boolean {
		if (item == null) {
			return false;
		}
		const [value] = this.getValues(item);
		if (this.fixedValue !== undefined) {
			return this.fixedValue === value;
		} else if (this.optional && value == null) {
			return true;
		} else if (this.isInstance != null) {
			return this.isInstance(value);
		} else {
			return true;
		}
	}

	public parentStringify(item: T): string | undefined {
		return this.stringify != null ? this.stringify(this.accessor(item)) : undefined;
	}

	public toString(): string {
		return this.name;
	}
}

export class TypeBuilder<T, U> {
	constructor(
		private readonly fields: TypeField<T, any>[] = [],
		private parent: Type<any> | undefined = undefined,
		private stringify: Stringifier<T> | undefined = undefined,
	) {
	}

	protected addField<Z>(field: TypeField<T, any>): TypeBuilder<T, Z> {
		let fieldIndex = this.fields.findIndex(sf => sf.name === field.name);
		if (fieldIndex >= 0) {
			this.fields.splice(fieldIndex, 1, field);
		} else {
			this.fields.push(field);
		}
		return this as TypeBuilder<T, unknown> as TypeBuilder<T, Z>;
	}

	public withFixed<K extends string & keyof Z & keyof T, V extends T[K], Z extends U & { [P in K]: V }>(
		key: K,
		value: V,
		stringify?: Stringifier<Z[K]>
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			true,
			item => item[key] as unknown as V,
			false, value,
			(v: any): v is V => v === value,
			(a, b) => a !== value || b !== value,
			stringify
		));
	}

	withName(name: string): U extends T ? Type<T> : never {
		return Type.fromFields<T>(name, this.parent, this.fields, this.stringify) as U extends T ? Type<T> : never;
	}

	public withOptionalScalarField<K extends string & keyof Z & keyof T, V extends T[K], Z extends U & { [P in K]?: V }>(
		key: K,
		isInstance: IsInstance<V> | null = null,
		equals: Comparator<V> | null = null,
		hasChanged: Comparator<V> | null = (a, b) => !equal(a, b),
		stringify?: Stringifier<V>,
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			false,
			item => item[key] as unknown as V,
			true,
			undefined,
			isInstance == null ? undefined : isInstance,
			hasChanged == null ? undefined : hasChanged,
			stringify,
		));
	}

	public withOptionalTypedField<K extends string & keyof Z & keyof T, V extends T[K], Z extends U & { [P in K]?: V }>(
		key: K,
		valueType: Type<V>,
		isInstance: IsInstance<V> | null = null,
		equals: Comparator<V> | null = null,
		hasChanged: Comparator<V> | null = (a, b) => (a != null && b != null && valueType.hasChanged(a, b)) || (a == null && b != null) || (a != null && b == null),
		stringify: Stringifier<V> | null = null,
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			false,
			item => item[key] as unknown as V,
			true,
			undefined,
			isInstance == null ? undefined : isInstance,
			hasChanged == null ? undefined : hasChanged,
			stringify == null ? undefined : stringify,
			valueType,
		));
	}

	public withParent(type: Type<any>): this {
		this.parent = type;
		return this;
	}

	public withScalarField<K extends string & keyof Z & keyof T, V extends T[K], Z extends U & { [P in K]: V }>(
		key: K,
		partOfId: boolean,
		isInstance: IsInstance<V>,
		equals: Comparator<V> | null,
		hasChanged: Comparator<V>,
		stringify?: Stringifier<V>,
		identifier?: (item: V) => string | undefined,
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			partOfId,
			item => item[key] as unknown as V,
			false,
			undefined,
			isInstance,
			hasChanged == null ? undefined : hasChanged,
			stringify,
			undefined,
			false,
			undefined,
			identifier,
		));
	}

	withStringify(stringify: Stringifier<T>): this {
		this.stringify = stringify;
		return this;
	}

	public withTypedField<K extends string & keyof Z & keyof T, V extends T[K], Z extends U & { [P in K]: V }>(
		key: K,
		valueType: Type<V>,
		partOfId: boolean = true,
		isInstance: IsInstance<V> | null = Type.isNotNull,
		hasChanged: Comparator<V> | null = valueType.hasChanged.bind(valueType),
		stringify: Stringifier<V> | null = null,
		identifier: (item: V) => (string | undefined) = valueType.identify.bind(valueType)
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			partOfId,
			item => item[key] as unknown as V,
			false,
			undefined,
			isInstance == null ? undefined : isInstance,
			hasChanged == null ? undefined : hasChanged,
			stringify == null ? undefined : stringify,
			valueType,
			false,
			undefined,
			identifier
		));
	}

	withTypedList<K extends string & keyof Z & keyof T, V extends ArrayField<T, K>, Z extends U & { [P in K]: V[] }>(
		key: K,
		itemType: Type<V>,
		isInstance: IsInstance<V[]> | null = (item: any): item is V[] => Type.isArray(item),
		hasChanged: Comparator<V[]> | null = (a, b) => itemType.hasChangedAny(a, b),
		stringify: Stringifier<V[]> | null = null,
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V[]>(
			key,
			false,
			item => item[key] as unknown as V[],
			false,
			undefined,
			isInstance == null ? undefined : isInstance,
			hasChanged == null ? undefined : hasChanged,
			stringify == null ? undefined : stringify,
			undefined,
			true,
			itemType,
		));
	}
}

export class Type<T> {
	public readonly logger: Logger;
	public readonly subtypes: Type<T>[] = [];

	protected constructor(
		public readonly name: string,
		public readonly isInstance: IsInstance<T>,
		public readonly hasChanged: Comparator<T>,
		public readonly stringify: Stringifier<T>,
		public readonly parent?: Type<any>,
		public readonly fields: TypeField<T, any>[] = [],
	) {
		this.logger = configureLogger(name, config);
	}

	public get lineage(): Type<any>[] {
		return this.parent == null ? [this] : ([this] as Type<any>[]).concat(...this.parent.lineage);
	}

	public static deepEquals(a: any, b: any): boolean {
		return equal(a, b);
	}

	public static deepNotEquals(a: any, b: any): boolean {
		return !equal(a, b);
	}

	public static from<T>(
		name: string,
		isInstance: IsInstance<T>,
		hasChanged: Comparator<T>,
		stringify: Stringifier<T>,
		parent?: Type<any>,
		fields?: TypeField<T, any>[],
	): Type<T> {
		return new Function("Type", "name", "isInstance", "hasChanged", "stringify", "parent", "fields", `
		class ${name} extends Type {
			constructor(name, isInstance, hasChanged, stringify, parent, fields) {
				super(name, isInstance, hasChanged, stringify, parent, fields);
			}
		}
		return new ${name}(name, isInstance, hasChanged, stringify, parent, fields);
		`)(
			Type,
			name,
			isInstance,
			hasChanged,
			stringify,
			parent,
			fields
		);
	}

	public static fromFields<T>(
		name: string,
		parent: Type<any> | undefined,
		fields: TypeField<T, any>[],
		stringify: Stringifier<T> = item => fields.map(field => field.parentStringify(item)).filter(Type.isNotNull).join(" ")
	): Type<T> {
		const logger = configureLogger(name, config);
		const isInstance: IsInstance<T> = (item: any): item is T => {
			const mismatch = fields.find(field => !field.parentIsInstance(item));
			return mismatch == null;
		}
		const hasChanged: Comparator<T> = (a, b) => {
			const aId = type.identify(a);
			const bId = type.identify(b);
			if (aId === "" || bId === "") {
				throw new Error(`[${name}] identify is busted`);
			} else if (aId !== bId) {
				throw new Error(`[${name}] hasChanged ID mismatch: "${aId}" <> "${bId}"`);
			}
			const diff = TypeDiff.forType(type, a, b);
			if (diff.hasChanged()) {
				logger.debug(`hasChanged "${aId}": ${diff}`);
				return true;
			}
			return false;
		}
		const type = Type.from(name, isInstance, hasChanged, stringify, parent, fields);
		return type;
	}

	public static isArray(item: any): item is [] {
		return Array.isArray(item);
	}

	public static isBoolean(item: any): item is boolean {
		return typeof item === "boolean";
	}

	public static isNotNull<T>(item: T): item is (T extends null ? never : T) {
		return item != null;
	}

	public static isNumber<N extends number>(item: any): item is N {
		return typeof item === "number";
	}

	public static isString<S extends string>(item: any): item is S {
		return typeof item === "string";
	}

	public static isTypedArray<U>(item: any, type: Type<U>): item is U[] {
		return Array.isArray(item) && (item.find(i => !type.isInstance(i)) == null);
	}

	public static novel<T>(): TypeBuilder<T, {}> {
		return new TypeBuilder<T, {}>();
	}

	public static strictEquals<T>(a: T, b: T): boolean {
		return a === b;
	}

	public static strictNotEquals<T>(a: T, b: T): boolean {
		return a !== b;
	}

	public cast(item: any): T {
		if (this.isInstance(item)) {
			return item;
		}
		throw new Error(`Illegal cast to ${this.name}: ${JSON.stringify(item, null, 2)}`);
	}

	hasChangedAny(a: Array<T>, b: Array<T>): boolean {
		if (a.length !== b.length) {
			return true;
		}
		return a.find((aItem, index) => this.hasChanged(aItem, b[index])) != null;
	}

	identify(value: T): string | undefined {
		const fieldIds = this.fields
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(field => field.parentIdentify(value))
			.filter(Type.isNotNull);
		return fieldIds.length == 0 ? undefined : fieldIds.join(" ");
	}

	public isAssignableFrom(otherType: Type<any> | undefined): boolean {
		return otherType === this || (otherType != null && otherType.parent != null && this.isAssignableFrom(otherType.parent));
	}

	public toBuilder<U extends T = T>(): TypeBuilder<U, T> {
		return new TypeBuilder<U, T>(
			this.fields.slice(),
			this,
			this.stringify,
		);
	}

	public toString(): string {
		return this.name;
	}
}
