import {
  calculatePercentage,
  getValueFromPercentage,
  getFormattedCount,
} from '../../utils/helpers/number';

// Test suite for number helper functions
describe('Number Helper Functions', () => {
  // Test case for calculatePercentage function
  test('calculatePercentage should return the correct percentage', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(75, 150)).toBe(50);
    expect(calculatePercentage(0, 200)).toBe(0);
  });

  // Test case for getValueFromPercentage function
  test('getValueFromPercentage should return the correct value', () => {
    expect(getValueFromPercentage(50, 100)).toBe(50);
    expect(getValueFromPercentage(50, 150)).toBe(75);
    expect(getValueFromPercentage(0, 200)).toBe(0);
  });

  // Test case for getFormattedCount function
  test('getFormattedCount should return the formatted count', () => {
    expect(getFormattedCount(0)).toBe('0');
    expect(getFormattedCount(500)).toBe('500');
    expect(getFormattedCount(1000)).toBe('1.0k');
    expect(getFormattedCount(1500)).toBe('1.5k');
  });
});
