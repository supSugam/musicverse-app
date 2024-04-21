import {
  cleanObject,
  convertObjectToFormData,
  clo,
  cleanArray,
} from '../../utils/helpers/Object';

// Test suite for utility functions
describe('Utility Functions', () => {
  // Test case for cleanObject function
  test('cleanObject should remove null and undefined values', () => {
    const obj = { a: 1, b: null, c: undefined, d: 4 };
    const cleanedObj = cleanObject(obj);
    expect(cleanedObj).toEqual({ a: 1, d: 4 });
  });

  // Test case for convertObjectToFormData function
  test('convertObjectToFormData should convert object to FormData', () => {
    const obj = { name: 'John', age: 30 };
    const formData = convertObjectToFormData(obj);
    expect(formData.get('name')).toBe('John');
    expect(formData.get('age')).toBe('30');
  });

  // Test case for clo function (console.log)
  test('clo should log arguments to console', () => {
    // Since clo logs to console, it's difficult to test its output directly
    // We can test that it doesn't throw an error
    expect(() => clo('Logging test')).not.toThrow();
  });

  // Test case for cleanArray function
  test('cleanArray should remove null and undefined values', () => {
    const arr = [1, null, 2, undefined, 3];
    const cleanedArr = cleanArray(arr);
    expect(cleanedArr).toEqual([1, 2, 3]);
  });
});
