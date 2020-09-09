/**
 * Group a list into a map of smaller lists, partitioned by a key generator.
 */
export function groupBy<K, V>(start: V[], keyGen: (value: V) => K): Map<K, V[]> {
  return start.reduce((values, value) => {
    const key = keyGen(value);
    let list = values.get(key);
    if (list == null) {
      list = [];
      values.set(key, list);
    }
    list.push(value);
    return values;
  }, new Map<K, V[]>());
}
