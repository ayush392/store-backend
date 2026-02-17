import { logger } from '../utils/logger';
import { DateOnlySchema } from './schemas';

const IST_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export const istDateString = (date = new Date()) => {
  return IST_FORMATTER.format(date);
};

export const parseISTDate = (dateStr?: string): Date => {
  return DateOnlySchema.parse(dateStr ?? istDateString());
};
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const getDateRange = (from: string, to?: string) => {
  if (from === 'today') {
    const startDate = parseISTDate();
    const endDate = addDays(startDate, 1);
    return { startDate, endDate };
  } else if (from === 'week') {
    const today = parseISTDate();
    const startDate = addDays(today, -6);
    const endDate = addDays(today, 1);
    return { startDate, endDate };
  }

  const startDate = parseISTDate(from);
  const endDate = addDays(parseISTDate(to ?? from), 1);

  return { startDate, endDate };
};

export const getMonthRange = (month: number, year: number) => {
  const monthStr = `${year}-${String(month).padStart(2, '0')}-01`;
  const start = parseISTDate(monthStr);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  logger.debug({ start, end });
  return { startDate: start, endDate: end };
};
