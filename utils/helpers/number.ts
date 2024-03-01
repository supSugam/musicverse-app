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
