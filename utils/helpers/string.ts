function splitStringFromLastDot(
  inputString: string
): [string, string | undefined] {
  const lastDotIndex = inputString.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return [inputString, undefined];
  } else {
    const firstPart = inputString.slice(0, lastDotIndex);
    const secondPart = inputString.slice(lastDotIndex + 1);
    return [firstPart, secondPart];
  }
}

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

export const extractExtension = (filename: string = ''): string => {
  return filename.split('.').pop() || '';
};

export const extractFilename = (filename?: string): string => {
  if (!filename) return '';
  const [fileName] = splitStringFromLastDot(filename);
  return fileName;
};

export const formatBytes = (bytes?: number, decimals = 2): string => {
  if (bytes === undefined) return '';
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Tranform seconds to formatted duration ie. 3600 -> 1:00:00, 120 -> 2:00, 60 -> 1:00
export const formatDuration = (seconds?: number, ms = false): string => {
  if (seconds === undefined) return '';
  if (ms) {
    seconds = seconds / 1000;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);
  return `${hours ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${
    sec < 10 ? '0' : ''
  }${sec}`;
};
