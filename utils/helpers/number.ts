export const calculatePercentage = (
  currentValue: number,
  maximumValue: number
): number => {
  return (currentValue / maximumValue) * 100;
};

export const getValueFromPercentage = (
  percentage: number,
  maximumValue: number
): number => {
  return (percentage / 100) * maximumValue;
};

export const getFormattedCount = (count?: number): string => {
  if (!count) return '0';
  if (count > 999) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};
