/**
 *
 * @param currentValue
 * @param maximumValue
 * @returns number
 */
export const calculatePercentage = (
  currentValue: number,
  maximumValue: number
): number => {
  return (currentValue / maximumValue) * 100;
};

/**
 *
 * @param percentage
 * @param maximumValue
 * @returns number
 */
export const getValueFromPercentage = (
  percentage: number,
  maximumValue: number
): number => {
  return (percentage / 100) * maximumValue;
};

/**
 *
 * @param count
 * @returns string
 */

export const getFormattedCount = (count?: number): string => {
  if (!count) return '0';
  if (count > 999) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};
