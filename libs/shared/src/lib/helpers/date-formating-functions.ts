import { DateTime } from 'luxon';

export const toFormatDate = (
  date: string,
  format: string = 'dd LL yyyy'
): string | undefined => {
  if (DateTime.fromISO(date).isValid) {
    return DateTime.fromISO(date, { zone: 'utc' })
      .setZone(DateTime.local().zone)
      .toFormat(format);
  }

  const fromMsToISO = DateTime.fromMillis(Date.parse(date)).toISO();
  if (!fromMsToISO) return;

  return DateTime.fromISO(fromMsToISO).toFormat(format);
};

export const toISO = (date: string): string | null => {
  return DateTime.fromMillis(Date.parse(date)).toISO({ includeOffset: false });
};
