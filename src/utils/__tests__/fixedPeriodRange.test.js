import { getCompleteFixedPeriodRange } from '../fixedPeriodRange.js'
import { WEEKLY } from '../time.js'

describe('fixed period range utils', () => {
    it('computes one-sided maximum bounds independently', () => {
        const result = getCompleteFixedPeriodRange({
            periodRange: { end: '2026-01-18' },
            periodType: WEEKLY,
            calendar: 'gregory',
            locale: 'en',
        })

        expect(result.hasCompleteFixedPeriods).toEqual(true)
        expect(result.minPeriodId).toBeUndefined()
        expect(result.maxPeriodId).toEqual('2026W3')
    })

    it('reports no complete fixed periods when bounds cross after snapping', () => {
        const result = getCompleteFixedPeriodRange({
            periodRange: {
                start: '2026-01-13',
                end: '2026-01-15',
            },
            periodType: WEEKLY,
            calendar: 'gregory',
            locale: 'en',
        })

        expect(result.hasCompleteFixedPeriods).toEqual(false)
    })
})
