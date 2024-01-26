export const joinClassNames = (classes: string[]): string => {
  return classes.join(' ');
};

export const isValidNumber = (char: string): boolean =>
  char.split('').every((c) => !isNaN(parseInt(c)));
