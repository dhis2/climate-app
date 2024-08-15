import {
  getNowInCalendar,
  convertFromIso8601,
  convertToIso8601,
} from "@dhis2/multi-calendar-dates";

/**
 * Formats a date string, timestamp or date array into format used by DHIS2 and <input> date
 * @param {Date} date
 * @returns {String}
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`; // xxxx-xx-xx
};

const lagTime = 10; // 10 days for ERA5-Land
const endTime = new Date();

endTime.setDate(endTime.getDate() - lagTime);
endTime.setDate(0); // Last day of the previous month

// First day 12 months back
const startTime = new Date(endTime.getFullYear(), endTime.getMonth() - 11, 1);

export const defaultPeriod = {
  startTime: formatDate(startTime),
  endTime: formatDate(endTime),
};

export const getNumberOfMonths = (startTime, endTime) => {
  const startYear = parseInt(startTime.substring(0, 4));
  const start = parseInt(startTime.substring(5, 7));
  const endYear = parseInt(endTime.substring(0, 4));
  const end = parseInt(endTime.substring(5, 7));
  return (endYear - startYear) * 12 + (end - start) + 1;
};

export const getNumberOfDays = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end - start;
  return diff / (1000 * 60 * 60 * 24) + 1;
};

export const getNumberOfDaysFromPeriod = (period) =>
  getNumberOfDays(period.startTime, period.endTime);

const padWithZeroes = (number, count = 2) =>
  String(number).padStart(count, "0");

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

export const toIso = (dateString, calendar) => {
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

export const fromIso = (dateString, calendar) => {
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

export const extractYear = (dateString) => {
  return parseInt(dateString.substring(0, 4));
};
