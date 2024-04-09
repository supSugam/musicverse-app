export const getFormattedDate = (date?: Date | null | number): string => {
  if (!date) return 'Not a Valid Date';
  const d = new Date(date);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();

  return `${day} ${month}, ${year}`;
};

export const getFormattedTime = (
  date?: Date | null | number | string
): string => {
  if (!date) return 'Not a Valid Date';
  const d = new Date(date);
  const now = new Date();

  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 60000 * 60) return `${Math.floor(diff / 60000)}m`;
  if (diff < 60000 * 60 * 24) return `${Math.floor(diff / 60000 / 60)}h`;
  if (diff < 60000 * 60 * 24 * 7)
    return `${Math.floor(diff / 60000 / 60 / 24)}d`;

  return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
};

export const getYear = (date?: Date | null | number | string): string => {
  if (!date) return '?';
  const d = new Date(date);
  return d.getFullYear().toString();
};
