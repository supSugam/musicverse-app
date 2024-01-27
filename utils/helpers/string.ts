export const joinClassNames = (classes: string[]): string => {
  return classes.join(' ');
};

export const isValidNumber = (char: string | undefined): boolean => {
  if (char === undefined) return false;
  return char
    .split('')
    .every((c) => !isNaN(parseInt(c)) && parseInt(c) >= 0 && parseInt(c) <= 9);
};
