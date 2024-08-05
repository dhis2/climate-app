import {
  getNowInCalendar,
  convertFromIso8601,
  convertToIso8601,
  generateFixedPeriods,
} from "@dhis2/multi-calendar-dates";

export const defaultReferencePeriod = "1991-2020";

const padWithZeroes = (number, count = 2) =>
  String(number).padStart(count, "0");

/**
 * Formats a date string, timestamp or date array into format used by DHIS2 and <input> date
 * @param {Date} date
 * @returns {String}
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = padWithZeroes(date.getMonth() + 1);
  const day = padWithZeroes(date.getDate());
  return `${year}-${month}-${day}`; // xxxx-xx-xx
};

const lagTime = 10; // 10 days for ERA5-Land
const endDate = new Date();

endDate.setDate(endDate.getDate() - lagTime);
endDate.setDate(0); // Last day of the previous month

// First day 12 months back
const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1);

export const defaultPeriod = {
  startDate: formatDate(startDate),
  endDate: formatDate(endDate),
};

export const getNumberOfMonths = (startMonth, endMonth) => {
  const startYear = parseInt(startMonth.substring(0, 4));
  const start = parseInt(startMonth.substring(5, 7));
  const endYear = parseInt(endMonth.substring(0, 4));
  const end = parseInt(endMonth.substring(5, 7));
  return (endYear - startYear) * 12 + (end - start) + 1;
};

export const getNumberOfDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;
  return diff / (1000 * 60 * 60 * 24) + 1;
};

export const getNumberOfDaysFromPeriod = (period) =>
  getNumberOfDays(period.startDate, period.endDate);

export const formatYyyyMmDD = (date) => {
  const year = date.eraYear ?? date.year;
  const month = padWithZeroes(date.month);
  const dayString = padWithZeroes(date.day);

  return `${year}-${month}-${dayString}`;
};

export const getCalendarDate = (calendar, period = { days: 0 }) => {
  const now = getNowInCalendar(calendar).add(period);
  return formatYyyyMmDD(now);
};

// Translate to gregorian date (ISO 8601) from DHIS2 date
export const toStandardDate = (dateString, calendar) => {
  const _date = dateString.split("-");

  const params = {
    year: _date[0],
    month: padWithZeroes(_date[1]),
    day: padWithZeroes(_date[2]),
  };

  const date = convertToIso8601(params, calendar);

  const year = date.eraYear ?? date.year;
  const month = padWithZeroes(date.month);
  const day = padWithZeroes(date.day);

  return `${year}-${month}-${day}`;
};

// Translate from gregorian date (ISO 8601) to DHIS2 date
export const fromStandardDate = (dateString, calendar) => {
  const _date = dateString.split("-");

  const params = {
    year: _date[0],
    month: padWithZeroes(_date[1]),
    day: padWithZeroes(_date[2]),
  };

  const date = convertFromIso8601(params, calendar);

  const year = date.eraYear ?? date.year;
  const month = padWithZeroes(date.month);
  const day = padWithZeroes(date.day);

  return `${year}-${month}-${day}`;
};

export const getStandardPeriod = (
  { startDate, endDate, timeZone },
  calendar
) => ({
  startDate: toStandardDate(startDate, calendar),
  endDate: toStandardDate(endDate, calendar),
  timeZone,
  calendar,
});

export const extractYear = (dateString) => {
  return parseInt(dateString.substring(0, 4));
};

// Create mapping between ISO 8601 date (gregorian) and DHIS2 date
export const getMappedPeriods = (period, periodType = "DAILY") => {
  const startYear = extractYear(
    fromStandardDate(period.startDate, period.calendar)
  );
  const endYear = extractYear(
    fromStandardDate(period.endDate, period.calendar)
  );

  let mappedPeriods = new Map();

  let periods = generateFixedPeriods({
    year: startYear,
    calendar: period.calendar,
    locale: "en",
    periodType,
  });

  if (startYear != endYear) {
    const endPeriods = generateFixedPeriods({
      year: endYear,
      calendar: period.calendar,
      locale: "en",
      periodType,
    });

    periods.push(...endPeriods);
  }

  periods.reduce((map, p) => {
    map.set(toStandardDate(p.startDate, period.calendar), p.iso);
    return map;
  }, mappedPeriods);

  return mappedPeriods;
};

export const isValidPeriod = (period) =>
  period &&
  period.startDate &&
  period.endDate &&
  new Date(period.startDate) <= new Date(perid.endDate);
