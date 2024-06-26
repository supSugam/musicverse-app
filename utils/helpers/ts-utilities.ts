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

export const getValueFromRecordByIndex = <T extends Record<string, any>>(
  record: T,
  index = 0
): T[keyof T] => {
  const keys = Object.keys(record);
  return record[keys[index]];
};

export const getKeyFromRecordByIndex = <T extends Record<string, any>>(
  record: T,
  index = 0
): keyof T => {
  const keys = Object.keys(record);
  return keys[index] as keyof T;
};

const stringifyValue = (value: any) => {
  if (!value) return value;

  if (typeof value === 'object') {
    return value;
  }
  return value.toString();
};

export const getObjectAsFormData = <T extends Object>(data: T): FormData => {
  const formData = new FormData();
  for (const key in data) {
    const value = data[key];
    if (Array.isArray(value)) {
      value.forEach((item: any, index: number) => {
        formData.append(`${key}[${index}]`, stringifyValue(item));
      });
    } else {
      formData.append(key, stringifyValue(value));
    }
  }
  return formData;
};

export type GenericPaginationResponse<T> = {
  items: T[];
  totalCount: number;
};

export type RecentSearchUtility<T extends { id: string }, K = string> = {
  type: K;
  data: T;
};

type IsAllOptional<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? true : false;
};

export type OptionalObject<T> = IsAllOptional<T>[keyof T] extends true
  ? T | undefined
  : T;

// export type Transparency<T,Opacity extends number> = T extends string ?
// T extends `#${infer C}` ?
// `#${C}${number}`:never
// :never;

// type Color = Transparency<"#fff",1>
