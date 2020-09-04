import equal = require("fast-deep-equal");

export type Consumer<T> = (item: T) => void;
export type IsInstance<T> = (item: any) => item is T;
export type Comparator<T> = (a: T, b: T) => boolean;
export type Stringifier<T> = (item: T) => string;
export type ArrayField<T, K extends string & keyof T> = T[K] extends Array<infer V> ? V : never;

export type Override<Type, Key extends keyof Type, Value extends Type[Key]> = {
	[Prop in Key]: Value;
};

export class TypeField<T, V> {
	constructor(
		readonly name: string,
		readonly accessor: (item: T) => V,
		readonly optional: boolean = false,
		readonly fixedValue?: V,
		readonly isInstance?: IsInstance<V>,
		readonly equals?: Comparator<V>,
		readonly hasChanged?: Comparator<V>,
		readonly stringify?: Stringifier<V>,
		readonly valueType?: Type<V>,
		readonly isArray: boolean = false,
		readonly itemType?: Type<V extends (infer I)[] ? I : never>
	) {
	}

	public static build<T, V>(
		name: string,
		accessor: (item: T) => V,
		optional: boolean = false,
		fixedValue?: V,
		isInstance?: IsInstance<V>,
		equals?: Comparator<V>,
		hasChanged?: Comparator<V>,
		stringify?: Stringifier<V>,
		valueType?: Type<V>,
		isArray: boolean = false,
		itemType?: Type<V extends (infer I)[] ? I : never>
	): TypeField<T, V> {
		return new Function("TypeField", "name", "accessor", "optional", "fixedValue", "isInstance", "equals", "hasChanged", "stringify", "valueType", "isArray", "itemType", `
		class ${name} extends TypeField {
			constructor(name, accessor, optional, fixedValue, isInstance, equals, hasChanged, stringify, valueType, isArray, itemType) {
				super(name, accessor, optional, fixedValue, isInstance, equals, hasChanged, stringify, valueType, isArray, itemType);
			}
		}
		return new ${name}(name, accessor, optional, fixedValue, isInstance, equals, hasChanged, stringify, valueType, isArray, itemType);
		`)(TypeField, name, accessor, optional, fixedValue, isInstance, equals, hasChanged, stringify, valueType, isArray, itemType);
	}

	public getValues(...items: T[]): V[] {
		return items.map(item => this.accessor(item));
	}

	public parentEquals(a: T, b: T): boolean {
		if (this.equals == null) {
			return true;
		}
		const [aValue, bValue] = this.getValues(a, b);
		return this.equals(aValue, bValue);
	}

	public parentHasChanged(a: T, b: T): boolean {
		if (this.hasChanged == null) {
			return false;
		}
		const [aValue, bValue] = this.getValues(a, b);
		return this.hasChanged(aValue, bValue);
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
}

export class TypeBuilder<T, U = {}> {
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
			item => item[key] as unknown as V,
			false, value,
			(v: any): v is V => v === value,
			(a, b) => a === b && b === value,
			(a, b) => a !== value || b != value,
			stringify
		));
	}

	withName(name: string): U extends T ? Type<T> : never {
		return Type.fromFields<T>(name, this.parent, this.fields) as U extends T ? Type<T> : never;
	}

	public withOptionalScalarField<K extends string & keyof Z & keyof T, V extends T[K], Z extends U & { [P in K]?: V }>(
		key: K,
		isInstance: IsInstance<V> | null = (v: any): v is V => v == null || isInstance == null || isInstance(v),
		equals: Comparator<V> | null = (a, b) => equals == null || equals(a, b),
		hasChanged: Comparator<V> = (a, b) => hasChanged != null && hasChanged(a, b),
		stringify?: Stringifier<V>,
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			item => item[key] as unknown as V,
			true,
			undefined,
			isInstance == null ? undefined : isInstance,
			equals == null ? undefined : equals,
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
			item => item[key] as unknown as V,
			true,
			undefined,
			isInstance == null ? undefined : isInstance,
			equals == null ? undefined : equals,
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
		isInstance: IsInstance<V> = Type.isNotNull,
		equals: Comparator<V> | null = null,
		hasChanged: Comparator<V> | null = (a, b) => !equal(a, b),
		stringify?: Stringifier<V>
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			item => item[key] as unknown as V,
			false,
			undefined,
			isInstance,
			equals == null ? undefined : equals,
			hasChanged == null ? undefined : hasChanged,
			stringify
		));
	}

	withStringify(stringify: Stringifier<T>): this {
		this.stringify = stringify;
		return this;
	}

	public withTypedField<K extends string & keyof Z & keyof T, V extends T[K], Z extends U & { [P in K]: V }>(
		key: K,
		valueType: Type<V>,
		isInstance: IsInstance<V> | null = valueType.isInstance.bind(valueType),
		equals: Comparator<V> | null = valueType.equals.bind(valueType),
		hasChanged: Comparator<V> | null = valueType.hasChanged.bind(valueType),
		stringify: Stringifier<V> | null = valueType.stringify.bind(valueType),
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V>(
			key,
			item => item[key] as unknown as V,
			false,
			undefined,
			isInstance == null ? undefined : isInstance,
			equals == null ? undefined : equals,
			hasChanged == null ? undefined : hasChanged,
			stringify == null ? undefined : stringify,
			valueType,
		));
	}

	withTypedList<K extends string & keyof Z & keyof T, V extends ArrayField<T, K>, Z extends U & { [P in K]: V[] }>(
		key: K,
		itemType: Type<V>,
		isInstance: IsInstance<V[]> | null = (item: any): item is V[] => Type.isArray(item),
		equals: Comparator<V[]> | null = null,
		hasChanged: Comparator<V[]> | null = (a, b) => itemType.hasChangedAny(a, b),
		stringify: Stringifier<V[]> | null = null,
	): TypeBuilder<T, Z> {
		return this.addField<Z>(TypeField.build<T, V[]>(
			key,
			item => item[key] as unknown as V[],
			false,
			undefined,
			isInstance == null ? undefined : isInstance,
			equals == null ? undefined : equals,
			hasChanged == null ? undefined : hasChanged,
			stringify == null ? undefined : stringify,
			undefined,
			true,
			itemType,
		));
	}
}

export class Type<T> {
	public readonly subtypes: Type<T>[] = [];

	protected constructor(
		public readonly name: string,
		public readonly isInstance: IsInstance<T>,
		public readonly equals: Comparator<T>,
		public readonly hasChanged: Comparator<T>,
		public readonly stringify: Stringifier<T>,
		public readonly parent?: Type<any>,
		public readonly scalarFields: TypeField<T, any>[] = [],
	) {
	}

	public get lineage(): Type<any>[] {
		return this.parent == null ? [this] : ([this] as Type<any>[]).concat(...this.parent.lineage);
	}

	public static from<T>(
		name: string,
		isInstance: IsInstance<T>,
		equals: Comparator<T>,
		hasChanged: Comparator<T>,
		stringify: Stringifier<T>,
		parent?: Type<any>,
		fields?: TypeField<T, any>[],
	): Type<T> {
		return new Function("Type", "name", "isInstance", "equals", "hasChanged", "stringify", "parent", "fields", `
		class ${name} extends Type {
			constructor(name, isInstance, equals, hasChanged, stringify, parent, fields) {
				super(name, isInstance, equals, hasChanged, stringify, parent, fields);
			}
		}
		return new ${name}(name, isInstance, equals, hasChanged, stringify, parent, fields);
		`)(
			Type,
			name,
			isInstance,
			equals,
			hasChanged,
			stringify,
			parent,
			fields
		);
	}

	public static fromFields<T>(name: string, parent: Type<any> | undefined, fields: TypeField<T, any>[]): Type<T> {
		const isInstance: IsInstance<T> = (item: any): item is T => fields.find(field => !field.parentIsInstance(item)) != null;
		const equals: Comparator<T> = (a, b) => fields.find(field => !field.parentEquals(a, b)) != null;
		const hasChanged: Comparator<T> = (a, b) => fields.find(field => field.parentHasChanged(a, b)) != null;
		const stringify: Stringifier<T> = item => fields.map(field => field.parentStringify(item)).filter(Type.isNotNull).join(" ");
		return Type.from(name, isInstance, equals, hasChanged, stringify, parent, fields);
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

	public static isNumber(item: any): item is number {
		return typeof item === "number";
	}

	public static isString(item: any): item is string {
		return typeof item === "string";
	}

	public static isTypedArray<U>(item: any, type: Type<U>): item is U[] {
		return Array.isArray(item) && (item.find(i => !type.isInstance(i)) == null);
	}

	public static novel<T>(): TypeBuilder<T, {}> {
		return new TypeBuilder<T>();
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

	public isAssignableFrom(otherType: Type<any> | undefined): boolean {
		return otherType === this || (otherType != null && otherType.parent != null && this.isAssignableFrom(otherType.parent));
	}

	public toBuilder<U extends T = T>(): TypeBuilder<U, T> {
		return new TypeBuilder<U, T>(
			this.scalarFields.slice(),
			this,
			this.stringify,
		);
	}

	public toString(): string {
		return this.name;
	}
}
