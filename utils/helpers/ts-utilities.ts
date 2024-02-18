// type KeysOfType<T, U> = {
//     [K in keyof T]: T[K] extends U ? K : never;
// }[keyof T];

function isMyCustomType<T extends Object>(value: any): boolean {
  const isValidKeys = Object.keys(value).every(
    (key) => (key as keyof T) in value
  );

  const hasValidLength =
    Object.keys(value).length === Object.keys({} as T).length;

  return isValidKeys && hasValidLength;
}
