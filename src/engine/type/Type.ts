import equal = require("fast-deep-equal");

export type Consumer<T> = (item: T) => void;
export type IsInstance<T> = (item: any) => item is T;
export type Comparator<T> = (a: T, b: T) => boolean;
export type Stringifier<T> = (item: T) => string;

export type Override<Type, Key extends keyof Type, Value extends Type[Key]> = {
	[Prop in Key]: Value;
};

interface ScalarField<T, V> {
	readonly accessor: (item: T) => V;
	readonly equals?: Comparator<V>;
	readonly fixedValue?: V;
	readonly hasChanged?: Comparator<V>;
	readonly isInstance?: IsInstance<V>;
	readonly name: string;
	readonly stringify?: Stringifier<V>;
}

export class TypeBuilder<T> {
	constructor(
		public readonly startType: Type<T>,
	) {
	}

	public withFixed<U extends T & Override<T, K, V>, K extends string & keyof T, V extends T[K]>(key: K, value: V): TypeBuilder<U> {
		let fieldIndex = this.startType.scalarFields.findIndex(sf => sf.name === key);
		const scalarField: ScalarField<U, V> = {
			name: key,
			equals: (a, b) => a === b && b === value,
			hasChanged: (a, b) => a !== value || b != value,
			isInstance: (item: any): item is V => item === value,
			fixedValue: value,
			accessor: (item: U) => item[key],
		};
		const scalarFields = fieldIndex < 0 ? [scalarField].concat(...this.startType.scalarFields) : this.startType.scalarFields.slice().splice(fieldIndex, 1, scalarField);
		return new TypeBuilder<U>(Type.from<U>(
			"",
			(item: any): item is U => item != null && item[key] === value && this.startType.isInstance(item),
			(a, b) => a[key] === b[key] && this.startType.equals(a, b),
			(a, b) => a[key] !== b[key] || this.startType.hasChanged(a, b),
			item => this.startType.stringify(item),
			this.startType.parent,
			scalarFields,
		));
	}

	withName<U extends T>(name: string): Type<U> {
		return this.startType.withName(name) as Type<U>;
	}

	public withOptionalScalarField<O extends T & { [P in K]?: V }, K extends string & keyof O, V>(key: K, isInstance?: IsInstance<V>, equals?: Comparator<V>, hasChanged?: Comparator<V>, stringify?: Stringifier<V>): TypeBuilder<O> {
		return new TypeBuilder<O>(Type.from<O>(
			"",
			(item: any): item is O => item != null && (isInstance == null || item[key] == null || isInstance(item[key])) && this.startType.isInstance(item),
			(a, b) => (equals == null || a[key] == null || b[key] == null || equals(a[key] as V, b[key] as V)) && this.startType.equals(a, b),
			(a, b) => (hasChanged == null ? equal(a[key], b[key]) : ((a[key] != null && b[key] != null && hasChanged(a[key] as V, b[key] as V)) || (a[key] == null && b[key] != null) || (a[key] != null && b[key] == null))) || this.startType.hasChanged(a, b),
			item => stringify && item[key] != null ? stringify(item[key] as V) : this.startType.stringify(item),
			this.startType.parent,
			([{
				name: key,
				isInstance,
				equals,
				hasChanged,
				stringify,
				accessor: (item: O) => item[key]
			}] as ScalarField<O, any>[]).concat(...this.startType.scalarFields),
		));
	}

	public withOptionalTypedField<O extends T & { [P in K]?: V }, K extends string & keyof O, V>(key: K, valueType: Type<V>, callEquals: boolean = true): TypeBuilder<O> {
		return new TypeBuilder<O>(Type.from<O>(
			"",
			(item: any): item is O => item != null && (item[key] == null || valueType.isInstance(item[key])) && this.startType.isInstance(item),
			(a, b) => {
				const aValue = a[key] as V | undefined;
				const bValue = b[key] as V | undefined;
				return (aValue == null && bValue == null) || (aValue != null && bValue != null && callEquals && valueType.equals(aValue, bValue)) && this.startType.equals(a, b);
			},
			(a, b) => {
				const aValue = a[key] as V | undefined;
				const bValue = b[key] as V | undefined;
				return (aValue != null && bValue != null && valueType.hasChanged(aValue, bValue)) ||
					(aValue == null && bValue != null) ||
					(aValue != null && bValue == null) ||
					this.startType.hasChanged(a, b);
			},
			item => item[key] == null ? this.startType.stringify(item) : valueType.stringify(item[key] as V),
			this.startType.parent,
			([{
				name: key,
				isInstance: (item: any): item is V => valueType.isInstance(item),
				equals: (a, b) => valueType.equals(a, b),
				hasChanged: (a, b) => valueType.hasChanged(a, b),
				stringify: item => valueType.stringify(item),
				accessor: (item: O) => item[key]
			} as ScalarField<O, any>]).concat(...this.startType.scalarFields)));
	}

	public withParent(type: Type<any>): TypeBuilder<T> {
		return new TypeBuilder<T>(this.startType.withParent(type));
	}

	public withScalarField<O extends T & { [P in K]: V }, K extends string & keyof O, V>(key: K, isInstance: IsInstance<V>, equals?: Comparator<V>, hasChanged?: Comparator<V>, stringify?: Stringifier<V>): TypeBuilder<O> {
		return new TypeBuilder<O>(Type.from<O>(
			"",
			(item: any): item is O => item != null && isInstance(item[key]) && this.startType.isInstance(item),
			(a, b) => (equals == null || equals(a[key], b[key])) && this.startType.equals(a, b),
			(a, b) => (hasChanged == null ? equal(a[key], b[key]) : hasChanged(a[key], b[key])) || this.startType.hasChanged(a, b),
			item => stringify ? stringify(item[key]) : this.startType.stringify(item),
			this.startType.parent,
			([{
				name: key,
				isInstance,
				equals,
				hasChanged,
				stringify,
				accessor: (item: O) => item[key]
			}] as ScalarField<O, any>[]).concat(...this.startType.scalarFields),
		));
	}

	public withTypedField<O extends T & { [P in K]: V }, K extends string & keyof O, V>(key: K, valueType: Type<V>): TypeBuilder<O> {
		return new TypeBuilder<O>(Type.from<O>(
			"",
			(item: any): item is O => item != null && valueType.isInstance(item[key]) && this.startType.isInstance(item),
			(a, b) => valueType.equals(a[key], b[key]) && this.startType.equals(a, b),
			(a, b) => valueType.hasChanged(a[key], b[key]) || this.startType.hasChanged(a, b),
			item => valueType.stringify(item[key]),
			this.startType.parent,
			([{
				name: key,
				isInstance: (item: any): item is V => valueType.isInstance(item),
				equals: (a, b) => valueType.equals(a, b),
				hasChanged: (a, b) => valueType.hasChanged(a, b),
				stringify: item => valueType.stringify(item),
				accessor: (item: O) => item[key]
			} as ScalarField<O, any>]).concat(...this.startType.scalarFields),
		));
	}

	withTypedList<O extends T & { [P in K]: V[] }, K extends string & keyof O, V>(key: K, itemType: Type<V>): TypeBuilder<O> {
		return new TypeBuilder<O>(Type.from<O>(
			"",
			(item: any): item is O => item != null && Array.isArray(item[key]) && this.startType.isInstance(item),
			(a, b) => this.startType.equals(a, b),
			(a, b) => itemType.hasChangedAny(a[key], b[key]) || this.startType.hasChanged(a, b),
			this.startType.stringify,
			this.startType.parent,
			([{
				name: key,
				isInstance: (item: any): item is V[] => Array.isArray(item) && item.find(i => !itemType.isInstance(i)) == null,
				equals: (a, b) => !itemType.hasChangedAny(a, b),
				hasChanged: (a, b) => itemType.hasChangedAny(a, b),
				accessor: (item: O) => item[key]
			} as ScalarField<O, V[]>]).concat(...this.startType.scalarFields),
		));
	}

	public wrappedAs<O extends { [P in K]: T }, K extends string & keyof O>(key: K, equals ?: Comparator<O>, hasChanged ?: Comparator<O>, stringify ?: Stringifier<O>): TypeBuilder<O> {
		return new TypeBuilder<O>(Type.from(
			"",
			(item: any): item is O => item != null && this.startType.isInstance(item[key]),
			(a, b) => (equals == null || equals(a, b)) && this.startType.equals(a[key], b[key]),
			(a, b) => (hasChanged != null && hasChanged(a, b)) || this.startType.hasChanged(a[key], b[key]),
			item => stringify ? stringify(item) : this.startType.stringify(item[key]),
			undefined,
			[{
				name: key,
				isInstance: (item: any): item is O => this.startType.isInstance(item),
				equals,
				hasChanged,
				stringify,
				accessor: item => item[key]
			}]
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
		public readonly scalarFields: ScalarField<T, any>[] = [],
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
		scalarFields?: ScalarField<T, any>[],
	): Type<T> {
		return new Type<T>(name, isInstance, equals, hasChanged, stringify, parent, scalarFields);
	}

	public static isArray(item: any): item is [] {
		return Array.isArray(item);
	}

	public static isBoolean(item: any): item is boolean {
		return typeof item === "boolean";
	}

	public static isNotNull(item: any): item is any {
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

	public static novel<T = {}>(stringify: Stringifier<T> = () => "?"): TypeBuilder<T> {
		return new TypeBuilder<T>(Type.from<T>(
			"",
			Type.isNotNull,
			(a, b) => a != null && b != null,
			() => false,
			stringify,
		));
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

	public toBuilder(): TypeBuilder<T> {
		return new TypeBuilder<T>(this);
	}

	public toString(): string {
		return this.name;
	}

	public withName(name: string): Type<T> {
		return new Function("Type", "name", "isInstance", "equals", "hasChanged", "stringify", "parent", "scalarFields", `
		class ${name} extends Type {
			constructor(name, isInstance, equals, hasChanged, stringify, parent, scalarFields) {
				super(name, isInstance, equals, hasChanged, stringify, parent, scalarFields);
			}
		}
		return new ${name}(name, isInstance, equals, hasChanged, stringify, parent, scalarFields);
		`)(
			Type,
			name,
			this.isInstance,
			this.equals,
			this.hasChanged,
			this.stringify,
			this.parent,
			this.scalarFields.slice()
		);
		// return new Type<T>(
		// 	name,
		// 	this.isInstance,
		// 	this.equals,
		// 	this.hasChanged,
		// 	this.stringify,
		// 	this.parent,
		// 	this.scalarFields.slice(),
		// );
	}

	public withParent(newParent: Type<any>): Type<T> {
		const subtype = new Type<T>(
			this.name,
			this.isInstance,
			this.equals,
			this.hasChanged,
			this.stringify,
			newParent,
			this.scalarFields.slice(),
		);
		newParent.subtypes.push(subtype);
		return subtype;
	}
}
