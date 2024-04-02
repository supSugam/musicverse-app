import { IUserCountStats, UserRole } from '../Interfaces/IUser';

export function splitStringFromLastDot(
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

// Transform ms to seconds
export const msToSeconds = (ms: number): number => {
  return ms / 1000;
};

export const parseStringToNullUndefined = (
  value: string | null | undefined
): null | undefined => {
  if (value === '') return null;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;
};

export const parseStringToBoolean = (value: string): boolean => {
  return value === 'true';
};

// Helper function to convert Blob to Base64 string
export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Capitalize the first letter of a whole string or each word in a string
 *
 * @param {string} str The string to capitalize
 * @param {boolean} [all=false] If true, capitalize the first letter of each word
 * @param {string} [separator=' '] The separator to split the string by
 * @return {*}  {string}
 */
export const capitalizeFirstLetter = (
  str: string,
  all: boolean = false,
  separator: string = ' '
): string => {
  if (all) {
    return str
      .split(separator)
      .map((word) => capitalizeFirstLetter(word))
      .join(' ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatNumber = (num?: number, mode: 'k' | 'comma' = 'k') => {
  if (num === undefined) return '-';
  switch (mode) {
    case 'k':
      return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
    case 'comma':
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    default:
      return num;
  }
};

// if user then show followers and following
// // if artist then show followers,
// export const getProfilePageCaption = (counts:IUserCountStats,role:UserRole)=>{
//   switch(role){
//     case UserRole.USER:
//       return `${counts.albums} Albums • ${counts.tracks} Tracks • ${counts.playlists} Playlists`;
//     case UserRole.ARTIST:
//       return `${counts.albums} Albums • ${counts.tracks} Tracks • ${counts.playlists} Playlists`;
//     case UserRole.ADMIN:
//       return `${counts.albums} Albums • ${counts.tracks} Tracks • ${counts.playlists} Playlists`;
//     case UserRole.MEMBER:
//       return `${counts.albums} Albums • ${counts.tracks} Tracks • ${counts.playlists} Playlists`;
//     default:
//       return `${counts.albums} Albums • ${counts.tracks} Tracks • ${counts.playlists} Playlists`;
//   }

// }
