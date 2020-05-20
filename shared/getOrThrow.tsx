export function getOrThrow<Key, Value>(map: Map<Key, Value>, key: Key): Value {
  if (!map.has(key)) {
    throw new Error(`The map was missing the key "${key}"`);
  }
  return map.get(key) as Value;
}
