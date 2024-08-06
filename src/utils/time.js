import {
  convertFromIso8601,
  convertToIso8601,
  generateFixedPeriods,
  getNowInCalendar,
} from "@dhis2/multi-calendar-dates";

export const HOURLY = "HOURLY";
export const DAILY = "DAILY";
export const MONTHLY = "MONTHLY";

export const defaultReferencePeriod = "1991-2020";

const oneDayInMs = 1000 * 60 * 60 * 24;

/**
 * Pads a number with zeroes to the left
 * @param {Number} number Number to pad
 * @param {Number} count Number of digits to pad to
 * @returns {String} Padded number
 */
export const padWithZeroes = (number, count = 2) =>
  String(number).padStart(count, "0");

/**
 * Formats a Date into a startad date string (ISO 8601)
 * @param {Date} date
 * @returns {String}
 */
export const formatStandardDate = (date) => {
  const year = date.getFullYear();
  const month = padWithZeroes(date.getMonth() + 1);
  const day = padWithZeroes(date.getDate());

  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

/**
 * Converts a calendar date object to a date string
 * @param {Object} date Calendar date object
 * @returns {String} Date string in the format YYYY-MM-DD
 */
export const formatCalendarDate = (date) => {
  const year = date.eraYear ?? date.year;
  const month = padWithZeroes(date.month);
  const day = padWithZeroes(date.day);

  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

/**
 * Returns calendar date by adding a period to the current date
 * @param {String} calendar Calendar used
 * @param {Object} period Period object
 * @returns {String} Date string in the format YYYY-MM-DD
 */
export const getCalendarDate = (calendar, period = { days: 0 }) => {
  const now = getNowInCalendar(calendar).add(period);
  return formatCalendarDate(now);
};

/**
 * Returns the default import data period
 * @param {String} calendar Calendar used
 * @returns {Object} Default import data period with calendar date strings
 */
export const getDefaultImportPeriod = (calendar) => ({
  startDate: getCalendarDate(calendar, { months: -7 }),
  endDate: getCalendarDate(calendar, { months: -1 }),
  calendar,
});

/**
 * Returns the default explore data period (12 months back)
 * @returns {Object} Default explore data period with standard date strings
 */
export const getDefaultExplorePeriod = () => {
  const lagTime = 10; // 10 days for ERA5-Land
  const endDate = new Date();

  endDate.setDate(endDate.getDate() - lagTime);
  endDate.setDate(0); // Last day of the previous month

  // First day 12 months back
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1);

  return {
    startDate: formatStandardDate(startDate),
    endDate: formatStandardDate(endDate),
  };
};

/**
 * Returns number of months between start and end month (inclusive)
 * @param {String} startMonth Start month in format YYYY-MM
 * @param {String} endMonth End month in format YYYY-MM
 * @returns {Number} Number of months between start and end month
 */
export const getNumberOfMonths = (startMonth, endMonth) => {
  const startYear = parseInt(startMonth.substring(0, 4));
  const start = parseInt(startMonth.substring(5, 7));
  const endYear = parseInt(endMonth.substring(0, 4));
  const end = parseInt(endMonth.substring(5, 7));

  return (endYear - startYear) * 12 + (end - start) + 1;
};

/**
 * Returns number of days between start and end date (inclusive)
 * @param {String} startDate Start date in format YYYY-MM-DD
 * @param {String} endDate End date in format YYYY-MM-DD
 * @returns {Number} Number of days between start and end date
 */
export const getNumberOfDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;

  return diff / oneDayInMs + 1;
};

/**
 * Returns number of days in a period object
 * @param {Object} period Period object with startDate and endDate
 * @returns {Number} Number of days in period
 */
export const getNumberOfDaysFromPeriod = (period) =>
  getNumberOfDays(period.startDate, period.endDate);

/**
 * Translates a date string to a date object
 * @param {String} dateString Date string in the format YYYY-MM-DD
 * @returns {Object} Date object with year, month and day
 */
export const toDateObject = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
};

/**
 * Extracts the year from a date string
 * @param {String} dateString Date string in the format YYYY-MM-DD
 * @returns {Number} Year
 */
export const extractYear = (dateString) => parseInt(dateString.split("-")[0]);

/**
 * Translates a calendar date to a standard date string
 * @param {String} dateString Calendar date string
 * @param {String} calendar Calendar used
 * @returns {String} Standard date string
 */
export const toStandardDate = (dateString, calendar) => {
  const date = convertToIso8601(toDateObject(dateString), calendar);
  const year = date.eraYear ?? date.year;
  const month = padWithZeroes(date.month);
  const day = padWithZeroes(date.day);

  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

/**
 * Translates a standard date to a calendar date string
 * @param {String} dateString Standard date string
 * @param {String} calendar Calendar used
 * @returns {String} Calendar date string
 */
export const fromStandardDate = (dateString, calendar) => {
  const date = convertFromIso8601(toDateObject(dateString), calendar);
  const year = date.eraYear ?? date.year;
  const month = padWithZeroes(date.month);
  const day = padWithZeroes(date.day);

  return `${year}-${month}-${day}`;
};

/**
 * Returns a standard period object from a calendar period object
 * @param {Object} period Calendar period object
 * @param {String} calendar Calendar used
 * @returns {Object} Standard period object
 */
export const getStandardPeriod = ({ startDate, endDate, calendar }) => ({
  startDate: toStandardDate(startDate, calendar),
  endDate: toStandardDate(endDate, calendar),
  calendar, // Include original calendar to allow conversion back to DHIS2 date
});

/**
 * Returns a map of standard dates and DHIS2 calendar dates for a period
 * @param {Object} period Standard period object
 * @param {String} periodType Period type
 * @param {String} locale Locale used for calendar
 * @returns {Map} Map with standard date as key and DHIS2 calendar date as value
 */
export const getMappedPeriods = (period, periodType = DAILY, locale = "en") => {
  const { startDate, endDate, calendar } = period;

  const startYear = extractYear(fromStandardDate(startDate, calendar));
  const endYear = extractYear(fromStandardDate(endDate, calendar));

  const mappedPeriods = new Map();

  const periods = generateFixedPeriods({
    year: startYear,
    calendar: period.calendar,
    locale,
    periodType,
  });

  if (startYear != endYear) {
    const endPeriods = generateFixedPeriods({
      year: endYear,
      calendar: period.calendar,
      locale,
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

/**
 * Checks if a period is valid
 * @param {Object} period Period object with startDate and endDate
 * @returns {Boolean} True if period is valid
 */
export const isValidPeriod = (period) =>
  Boolean(
    period &&
      period.startDate &&
      period.endDate &&
      new Date(period.startDate) <= new Date(period.endDate)
  );
