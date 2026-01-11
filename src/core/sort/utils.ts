export namespace SortUtils {
  export const sortByString = <T>(values: Array<T>, keyExtractor: (t: T) => string): Array<T> => {
    return values.sort((a, b) => {
      const aKey = keyExtractor(a);
      const bKey = keyExtractor(b);

      return aKey.localeCompare(bKey);
    });
  };
}
