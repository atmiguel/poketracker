export namespace SortUtils {
  export const sortByNumber = <T>(values: Array<T>, keyExtractor: (t: T) => number): Array<T> => {
    return values.sort((a, b) => {
      const aKey = keyExtractor(a);
      const bKey = keyExtractor(b);

      return aKey - bKey;
    });
  };

  export const sortByString = <T>(values: Array<T>, keyExtractor: (t: T) => string): Array<T> => {
    return values.sort((a, b) => {
      const aKey = keyExtractor(a);
      const bKey = keyExtractor(b);

      return aKey.localeCompare(bKey);
    });
  };
}
