import { create } from "zustand";
import {
  getDefaultMonthlyPeriod,
  getDefaultExplorePeriod,
  getLastMonth,
} from "../utils/time";
import { defaultReferencePeriod } from "../components/explore/ReferencePeriodSelect";
import { MONTHLY } from "../utils/time";

const exploreStore = create((set) => ({
  orgUnit: null,
  tab: null,
  periodType: MONTHLY,
  dailyPeriod: getDefaultExplorePeriod(),
  monthlyPeriod: getDefaultMonthlyPeriod(),
  referencePeriod: defaultReferencePeriod,
  month: getLastMonth()[1],
  setOrgUnit: (orgUnit) => set({ orgUnit }),
  setTab: (tab) => set({ tab }),
  setPeriodType: (periodType) => set({ periodType }),
  setDailyPeriod: (dailyPeriod) => set({ dailyPeriod }),
  setMonthlyPeriod: (monthlyPeriod) => set({ monthlyPeriod }),
  setReferencePeriod: (referencePeriod) => set({ referencePeriod }),
  setMonth: (month) => set({ month }),
}));

export default exploreStore;
