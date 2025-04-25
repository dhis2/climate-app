import { create } from 'zustand'
import {
    getDefaultMonthlyPeriod,
    getDefaultExplorePeriod,
    getLastMonth,
    MONTHLY,
} from '../utils/time.js'

const localStore = create((set) => {
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
        month: getLastMonth()[1],
        dataConnector: null,
        datasets: [],
        setOrgUnit: setIfChanged('orgUnit'),
        setTab: setIfChanged('tab'),
        setPeriodType: setIfChanged('periodType'),
        setDailyPeriod: setIfPeriodChanged('dailyPeriod'),
        setMonthlyPeriod: setIfPeriodChanged('monthlyPeriod'),
        setMonth: setIfChanged('month'),
        setDataConnector: setIfChanged('dataConnector'),
        setDatasets: setIfChanged('datasets'),
    }
})

export default localStore
