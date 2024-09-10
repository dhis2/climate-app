import { create } from "zustand";
import {
  getDefaultMonthlyPeriod,
  getDefaultExplorePeriod,
  getLastMonth,
} from "./time";
import { defaultReferencePeriod } from "../components/explore/ReferencePeriodSelect";
import { MONTHLY } from "./time";
import OrgUnit from "../components/explore/OrgUnit";

const exploreStore = create((set) => ({
  orgUnit: null,
  tab: null,
  periodType: MONTHLY,
  dailyPeriod: getDefaultExplorePeriod(),
  monthlyPeriod: getDefaultMonthlyPeriod(),
  referencePeriod: defaultReferencePeriod,
  month: getLastMonth(),
  setOrgUnit: (orgUnit) => set({ orgUnit }),
  setTab: (tab) => set({ tab }),
  setPeriodType: (periodType) => set({ periodType }),
  setDailyPeriod: (dailyPeriod) => set({ dailyPeriod }),
  setMonthlyPeriod: (monthlyPeriod) => set({ monthlyPeriod }),
  setReferencePeriod: (referencePeriod) => set({ referencePeriod }),
  setMonth: (month) => set({ month }),
}));

export default exploreStore;
