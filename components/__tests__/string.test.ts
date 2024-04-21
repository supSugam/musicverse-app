import {
  splitStringFromLastDot,
  formatBytes,
  formatDuration,
  msToSeconds,
  parseStringToNullUndefined,
  parseStringToBoolean,
  capitalizeFirstLetter,
  formatNumber,
} from '../../utils/helpers/string';

// Test suite for utility functions
describe('Utility Functions', () => {
  // Test case for splitStringFromLastDot function
  test('splitStringFromLastDot should split string from the last dot', () => {
    expect(splitStringFromLastDot('example.test')).toEqual(['example', 'test']);
    expect(splitStringFromLastDot('example.test.jpg')).toEqual([
      'example.test',
      'jpg',
    ]);
    expect(splitStringFromLastDot('example')).toEqual(['example', undefined]);
  });

  // Test case for formatBytes function
  test('formatBytes should format bytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  // Test case for formatDuration function
  test('formatDuration should format duration correctly', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(120)).toBe('02:00');
    expect(formatDuration(60)).toBe('01:00');
  });

  // Test case for msToSeconds function
  test('msToSeconds should convert milliseconds to seconds', () => {
    expect(msToSeconds(1000)).toBe(1);
    expect(msToSeconds(5000)).toBe(5);
  });

  // Test case for parseStringToNullUndefined function
  test('parseStringToNullUndefined should parse string values to null or undefined', () => {
    expect(parseStringToNullUndefined('')).toBe(null);
    expect(parseStringToNullUndefined('null')).toBe(null);
    expect(parseStringToNullUndefined('undefined')).toBe(undefined);
  });

  // Test case for parseStringToBoolean function
  test('parseStringToBoolean should parse string values to boolean', () => {
    expect(parseStringToBoolean('true')).toBe(true);
    expect(parseStringToBoolean('false')).toBe(false);
  });

  // Test case for capitalizeFirstLetter function
  test('capitalizeFirstLetter should capitalize the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('hello world', true)).toBe('Hello World');
  });

  // Test case for formatNumber function
  test('formatNumber should format numbers correctly', () => {
    expect(formatNumber(1000)).toBe('1k');
    expect(formatNumber(10000)).toBe('10k');
    expect(formatNumber(1000, 'comma')).toBe('1,000');
  });
});
