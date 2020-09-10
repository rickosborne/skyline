import {BiFunction} from "../engine/type/Type";

export function addIfNotFound<T>(items: T[], item: T, predicate: BiFunction<T, number, boolean> = i => i === item): T[] {
	if (items.findIndex(predicate) < 0) {
		items.push(item);
	}
	return items;
}

export function addIfNotIncluded<T>(items: T[], item: T): T[] {
	if (!items.includes(item)) {
		items.push(item);
	}
	return items;
}
