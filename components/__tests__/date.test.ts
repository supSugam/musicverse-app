import {
  getFormattedDate,
  getFormattedTime,
  getYear,
} from '../../utils/helpers/date';

test('getFormattedDate', () => {
  expect(getFormattedDate(1633000000000)).toBe('30 Sep, 2021');
  expect(getFormattedDate(1633000000000)).not.toBe('31 Sep, 2021');
  expect(getFormattedDate(1633000000000)).not.toBe('1 Oct, 2021');
});

test('getFormattedTime', () => {
  expect(getFormattedTime(Date.now() - 1000)).toBe('1s');
  expect(getFormattedTime(Date.now() - 1000)).not.toBe('2s');
  expect(getFormattedTime(Date.now() - 7 * 24 * 60 * 60 * 1000)).toBe('Apr 14');
});

test('getYear', () => {
  expect(getYear(new Date(1633000000000))).toBe('2021');
  expect(getYear(new Date(1633000000000))).not.toBe('2022');
  expect(getYear(new Date(1633000000000))).not.toBe('2020');
});
