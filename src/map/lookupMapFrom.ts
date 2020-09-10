import {UniFunction} from "../engine/type/Type";

export function lookupMapFrom<T, K>(items: T[], keyBuilder: UniFunction<T, K>): Map<K, T> {
	return items.reduce((lookup, item) => {
		const key = keyBuilder(item);
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
