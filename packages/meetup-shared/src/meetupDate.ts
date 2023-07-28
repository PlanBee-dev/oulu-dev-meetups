import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

export function getMeetupDate(date: string, time: string) {
  const parsedDate = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());

  if (!isValid(parsedDate)) {
    throw new Error('Invalid date');
  }

  return parsedDate;
}

export function getFormattedMeetupDate(date: Date) {
  return format(date, 'yyyy-MM-dd HH:mm');
}
