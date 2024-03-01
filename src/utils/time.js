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

const currentYear = new Date().getFullYear();
const lastYear = currentYear - 1;
const endDate = new Date(`${lastYear}-12-31`);
const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1); // 12 months back

export const defaultPeriod = {
  startDate: formatDate(startDate),
  endDate: formatDate(endDate),
};

export const defaultReferencePeriod = "1991-2020";
