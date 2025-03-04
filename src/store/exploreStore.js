import { create } from 'zustand'
import { defaultReferencePeriod } from '../components/explore/ReferencePeriodSelect.jsx'
import { NDVI } from '../components/explore/vegetation/VegetationIndexSelect.jsx'
import {
    getDefaultMonthlyPeriod,
    getDefaultExplorePeriod,
    getLastMonth,
    MONTHLY,
} from '../utils/time.js'

const exploreStore = create((set) => {
    const setIfChanged = (key) => (value) =>
        set((state) => (state[key] !== value ? { [key]: value } : state))

    const setIfPeriodChanged = (key) => (period) =>
        set((state) =>
            state[key].startTime !== period.startTime ||
            state[key].endTime !== period.endTime
                ? { [key]: period }
                : state
        )

    return {
        orgUnit: null,
        tab: null,
        periodType: MONTHLY,
        dailyPeriod: getDefaultExplorePeriod(),
        monthlyPeriod: getDefaultMonthlyPeriod(),
        referencePeriod: defaultReferencePeriod,
        month: getLastMonth()[1],
        vegetationIndex: NDVI,
        setOrgUnit: setIfChanged('orgUnit'),
        setTab: setIfChanged('tab'),
        setPeriodType: setIfChanged('periodType'),
        setDailyPeriod: setIfPeriodChanged('dailyPeriod'),
        setMonthlyPeriod: setIfPeriodChanged('monthlyPeriod'),
        setReferencePeriod: setIfChanged('referencePeriod'),
        setMonth: setIfChanged('month'),
        setVegetationIndex: setIfChanged('vegetationIndex'),
    }
})

export default exploreStore
