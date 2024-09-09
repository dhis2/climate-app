import { create } from "zustand";
import {
  getDefaultMonthlyPeriod,
  getDefaultExplorePeriod,
  getLastMonth,
} from "./time";
import { defaultReferencePeriod } from "../components/explore/ReferencePeriodSelect";
import { MONTHLY } from "./time";

const exploreStore = create((set) => ({
  tab: null,
  periodType: MONTHLY,
  dailyPeriod: getDefaultExplorePeriod(),
  monthlyPeriod: getDefaultMonthlyPeriod(),
  referencePeriod: defaultReferencePeriod,
  month: getLastMonth(),
  // periodType: null,
  // dailyPeriod: null,
  // monthlyPeriod: null,
  // referencePeriod: null,
  // month: null,
  setTab: (tab) => set({ tab }),
  setPeriodType: (periodType) => set({ periodType }),
  setDailyPeriod: (dailyPeriod) => set({ dailyPeriod }),
  setMonthlyPeriod: (monthlyPeriod) => set({ monthlyPeriod }),
  setReferencePeriod: (referencePeriod) => set({ referencePeriod }),
  setMonth: (month) => set({ month }),
}));

export default exploreStore;
