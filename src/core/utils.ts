export namespace CoreUtils {
  export const assertNever = (_: never): never => {
    throw new Error('expected value to be never');
  };

  export const range = (max: number): Array<number> => {
    return Array.from(Array(max).keys());
  };
}
