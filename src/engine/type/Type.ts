export type Consumer<T> = (item: T) => void;
export type IsInstance<T> = (item: any) => item is T;
export type Comparator<T> = (a: T, b: T) => boolean;
export type Stringifier<T> = (item: T) => string;

export class Type<T> {
	protected constructor(
		public readonly name: string,
		public readonly isInstance: IsInstance<T>,
		public readonly equals: Comparator<T>,
		public readonly hasChanged: Comparator<T>,
		public readonly stringify: Stringifier<T>,
		public readonly parent?: Type<any>,
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
	): Type<T> {
		return new Type<T>(name, isInstance, equals, hasChanged, stringify);
	}

	public isAssignableFrom(otherType: Type<any> | undefined): boolean {
		return otherType === this || (otherType != null && otherType.parent != null && this.isAssignableFrom(otherType.parent));
	}

	public subtype<U extends T>(name: string, isInstance: IsInstance<U>, equals: Comparator<U>, hasChanged: Comparator<U>, stringify: Stringifier<U>): Type<U> {
		return new Type<U>(
			name,
			(item: any): item is U => isInstance(item) && this.isInstance(item),
			(a, b) => equals(a, b) && this.equals(a, b),
			(a, b) => hasChanged(a, b) || this.hasChanged(a, b),
			stringify,
			this
		);
	}

	public toString(): string {
		return this.name;
	}
}
