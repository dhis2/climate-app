import { create } from 'zustand'
import { defaultReferencePeriod } from '../components/explore/ReferencePeriodSelect.jsx'
import {
    getDefaultMonthlyPeriod,
    getDefaultExplorePeriod,
    getLastMonth,
    MONTHLY,
} from '../utils/time.js'

const exploreStore = create((set) => ({
    orgUnit: null,
    tab: null,
    periodType: MONTHLY,
    dailyPeriod: getDefaultExplorePeriod(),
    monthlyPeriod: getDefaultMonthlyPeriod(),
    showForecast: false,
    referencePeriod: defaultReferencePeriod,
    month: getLastMonth()[1],
    setOrgUnit: (orgUnit) => set({ orgUnit }),
    setTab: (tab) => set({ tab }),
    setPeriodType: (periodType) => set({ periodType }),
    setDailyPeriod: (dailyPeriod) => set({ dailyPeriod }),
    setMonthlyPeriod: (monthlyPeriod) => set({ monthlyPeriod }),
    setShowForecast: (showForecast) => set({ showForecast }),
    setReferencePeriod: (referencePeriod) => set({ referencePeriod }),
    setMonth: (month) => set({ month }),
}))

export default exploreStore
