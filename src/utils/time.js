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

export const defaultReferencePeriod = "1991-2020";

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
