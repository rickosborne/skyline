import {BiFunction} from "../engine/type/Type";

export function lookupMapFrom<T, K>(items: T[], keyBuilder: BiFunction<T, number, K>): Map<K, T> {
	return items.reduce((lookup, item, index) => {
		const key = keyBuilder(item, index);
		if (key == null) {
			throw new Error(`Cannot have a null key`);
		}
		const existing = lookup.get(key);
		if (existing != null) {
			throw new Error(`Duplicate item for key ${JSON.stringify(key)}`);
		}
		lookup.set(key, item);
		return lookup;
	}, new Map<K, T>());
}

export function lookupRecordFrom<T>(items: T[], keyBuilder: BiFunction<T, number, string>): Record<string, T> {
	return items.reduce((lookup, item, index) => {
		const key = keyBuilder(item, index);
		if (key == null) {
			throw new Error(`Cannot have a null key`);
		}
		const existing = lookup[key];
		if (existing != null) {
			throw new Error(`Duplicate item for key ${JSON.stringify(key)}`);
		}
		lookup[key] = item;
		return lookup;
	}, {} as Record<string, T>);
}
