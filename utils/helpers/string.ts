export const joinClassNames = (classes: string[]): string => {
  return classes.join(' ');
};

export const isValidNumber = (char: string | undefined): boolean => {
  if (char === undefined) return false;
  return char
    .split('')
    .every((c) => !isNaN(parseInt(c)) && parseInt(c) >= 0 && parseInt(c) <= 9);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};
