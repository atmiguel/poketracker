export const getRequiredValue = <K extends string, V>(
  obj: Record<K, V>,
  key: K,
): V => {
  if (!(key in obj)) {
    throw new Error(`expected object to contain key: ${key}`);
  }

  return obj[key];
};