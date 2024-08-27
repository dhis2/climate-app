import { create } from "zustand";
import { getDefaultMonthlyPeriod, getDefaultExplorePeriod } from "./time";
import { defaultReferencePeriod } from "../components/explore/ReferencePeriodSelect";
import { MONTHLY } from "./time";

const explorePeriodStore = create((set) => ({
  periodType: MONTHLY,
  dailyPeriod: getDefaultExplorePeriod(),
  monthlyPeriod: getDefaultMonthlyPeriod(),
  referencePeriod: defaultReferencePeriod,
  setPeriodType: (periodType) => set({ periodType }),
  setDailyPeriod: (dailyPeriod) => set({ dailyPeriod }),
  setMonthlyPeriod: (monthlyPeriod) => set({ monthlyPeriod }),
  setReferencePeriod: (referencePeriod) => set({ referencePeriod }),
}));

export default explorePeriodStore;
