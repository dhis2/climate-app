const endDate = new Date();
const startDate = new Date().setFullYear(endDate.getFullYear() - 1);

export const defaultPeriod = {
  startDate: new Date(startDate).toISOString().slice(0, 10),
  endDate: endDate.toISOString().slice(0, 10),
};
