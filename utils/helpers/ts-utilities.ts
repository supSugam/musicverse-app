// // type KeysOfType<T, U> = {
// //     [K in keyof T]: T[K] extends U ? K : never;
// // }[keyof T];

// export function isMyCustomType<T extends Object>(value: any): boolean {
//   const isValidKeys = Object.keys(value).every(
//     (key) => (key as keyof T) in value
//   );
//   console.log(Object.keys(value), Object.keys(value).length,'val');
//   console.log(Object.keys({} as T), Object.keys(value).length,'val');

//   const hasValidLength =
//     Object.keys(value).length === Object.keys({} as T).length;

//   return isValidKeys && hasValidLength;
// }
