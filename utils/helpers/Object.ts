export const cleanObject = <T extends Object>(
  obj: T,
  { includeNull = false, includeUndefined = false } = {
    includeNull: false,
    includeUndefined: false,
  }
): T => {
  const cleanedObj = {} as T;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        cleanedObj[key] = value;
      } else if (includeNull && value === null) {
        cleanedObj[key] = value;
      } else if (includeUndefined && value === undefined) {
        cleanedObj[key] = value;
      }
    }
  }
  return cleanedObj;
};

export const convertObjectToFormData = (obj: any): FormData => {
  const formData = new FormData();
  for (const key in obj) {
    const val = obj[key];
    if (Array.isArray(val)) {
      val.forEach((item: any, index: number) => {
        if (item !== null || item !== undefined) {
          formData.append(`${key}[${index}]`, item.toString());
        }
      });
    } else {
      if (val === null || val === undefined) {
        continue;
      }

      formData.append(key, typeof val === 'object' ? val : val.toString());
    }
  }
  return formData;
};

export const consoleLogFormattedObject = (obj: any, name?: string) => {
  console.log(`\n------------------ ${name} ------------------\n`);
  console.log(JSON.stringify(obj, null, 2));
  console.log(`\n------------------ ${name} ------------------\n`);
};

export const cleanArray = <T extends unknown>(
  arr: T[],
  { includeNull = false, includeUndefined = false } = {
    includeNull: false,
    includeUndefined: false,
  }
): T[] => {
  return arr.filter((val) => {
    switch (val) {
      case undefined:
        return includeUndefined;
      case null:
        return includeNull;
      default:
        return true;
    }
  });
};
