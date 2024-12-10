import { create } from "zustand";
import {
  getDefaultMonthlyPeriod,
  getDefaultExplorePeriod,
  getLastMonth,
} from "../utils/time";
import { defaultReferencePeriod } from "../components/explore/ReferencePeriodSelect";
import { MONTHLY } from "../utils/time";
import { NDVI } from "../components/explore/land/VegetationIndexSelect";

const exploreStore = create((set) => ({
  orgUnit: null,
  tab: null,
  periodType: MONTHLY,
  dailyPeriod: getDefaultExplorePeriod(),
  monthlyPeriod: getDefaultMonthlyPeriod(),
  referencePeriod: defaultReferencePeriod,
  month: getLastMonth(),
  vegetationIndex: NDVI,
  landCoverType: 13,
  setOrgUnit: (orgUnit) => set({ orgUnit }),
  setTab: (tab) => set({ tab }),
  setPeriodType: (periodType) => set({ periodType }),
  setDailyPeriod: (dailyPeriod) => set({ dailyPeriod }),
  setMonthlyPeriod: (monthlyPeriod) => set({ monthlyPeriod }),
  setReferencePeriod: (referencePeriod) => set({ referencePeriod }),
  setMonth: (month) => set({ month }),
  setVegetationIndex: (vegetationIndex) => set({ vegetationIndex }),
  setLandCoverType: (landCoverType) => set({ landCoverType }),
}));

export default exploreStore;
