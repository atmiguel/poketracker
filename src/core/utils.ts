export namespace UCore {
  export const assertNever = (_: never): never => {
    throw new Error('expected value to be never');
  };
}
