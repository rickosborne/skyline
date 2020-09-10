import {UniFunction} from "../engine/type/Type";

export function computeIfAbsent<K, V>(map: Map<K, V> | Record<K & string, V>, key: K, compute: UniFunction<K, V>): V {
	let value = map instanceof Map ? map.get(key) : map[key as K & string];
	if (value == null) {
		value = compute(key);
		if (map instanceof Map) {
			map.set(key, value);
		} else {
			map[key as K & string] = value;
		}
	}
	return value;
}
