import i18n from '@dhis2/d2-i18n'
import {
    IconChevronDown16,
    IconChevronLeft16,
    IconChevronRight16,
    Layer,
    Popper,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
    MONTHLY,
    WEEKLY,
    compareFixedPeriods,
    createFixedPeriodFromPeriodId,
    generateFixedPeriods,
    getTodayInCalendar,
    normalizeDhis2Calendar,
} from '../../utils/periodEngine.js'
import styles from './PeriodPicker.module.css'

const getPeriodYear = (periodId) => {
    if (!periodId) {
        return undefined
    }

    const yearMatch = /^(\d{4})/.exec(String(periodId))
    return yearMatch ? Number(yearMatch[1]) : undefined
}

const createFixedPeriodSafely = (options) => {
    try {
        return createFixedPeriodFromPeriodId(options)
    } catch {
        return undefined
    }
}

const getCurrentCalendarYear = (calendar) =>
    Number(getTodayInCalendar({ calendar }).substring(0, 4))

const getInitialVisibleYear = ({
    value,
    referencePeriodId,
    maxPeriodId,
    minPeriodId,
    calendar,
}) =>
    getPeriodYear(value) ??
    getPeriodYear(referencePeriodId) ??
    getPeriodYear(maxPeriodId) ??
    getPeriodYear(minPeriodId) ??
    getCurrentCalendarYear(calendar)

const isMonthlyPeriodType = (periodType) => periodType === MONTHLY
const isWeeklyPeriodType = (periodType) => periodType === WEEKLY

const getMonthlyReferenceLabel = (periodId) =>
    `${periodId.slice(0, 4)}-${periodId.slice(4, 6)}`

const getMonthlyYear = (periodId) => periodId.slice(0, 4)
const getMonthlyMonth = (periodId) => Number(periodId.slice(4, 6))

const formatGregorianMonthName = (periodId, locale) => {
    const year = Number(getMonthlyYear(periodId))
    const monthIndex = getMonthlyMonth(periodId) - 1

    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, monthIndex, 1)))
}

const formatGregorianMonthlyLabel = (periodId, locale) => {
    const year = Number(getMonthlyYear(periodId))
    const monthIndex = getMonthlyMonth(periodId) - 1

    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        timeZone: 'UTC',
        year: 'numeric',
    }).format(new Date(Date.UTC(year, monthIndex, 1)))
}

const getFallbackMonthlyLabel = (period, calendar, locale) => {
    if (calendar === 'gregory' || calendar === 'iso8601') {
        return formatGregorianMonthlyLabel(period.id, locale)
    }

    return i18n.t('Month {{month}}, {{year}}', {
        month: getMonthlyMonth(period.id),
        year: getMonthlyYear(period.id),
    })
}

const getFallbackMonthlyCellLabel = (period, calendar, locale) => {
    if (calendar === 'gregory' || calendar === 'iso8601') {
        return formatGregorianMonthName(period.id, locale)
    }

    return i18n.t('Month {{month}}', {
        month: getMonthlyMonth(period.id),
    })
}

const removeMonthlyYearFromLabel = (label, periodId) => {
    const labelWithoutYear = label
        .replace(getMonthlyYear(periodId), '')
        .replace(/\s+/g, ' ')
        .trim()

    return labelWithoutYear || label
}

const getPeriodPrimaryLabel = (period, calendar, locale) => {
    if (!period) {
        return undefined
    }

    const label = (period.displayName || period.name)?.trim()
    if (
        label &&
        isMonthlyPeriodType(period.periodType) &&
        label === period.id.slice(0, 4)
    ) {
        return getFallbackMonthlyLabel(period, calendar, locale)
    }

    return label || period.id
}

const getPeriodCellPrimaryLabel = (period, calendar, locale) => {
    if (!isMonthlyPeriodType(period.periodType)) {
        return getPeriodPrimaryLabel(period, calendar, locale)
    }

    const label = (period.displayName || period.name)?.trim()
    if (label && label !== getMonthlyYear(period.id)) {
        return removeMonthlyYearFromLabel(label, period.id)
    }

    return getFallbackMonthlyCellLabel(period, calendar, locale)
}

const getPeriodSecondaryLabel = (period) => {
    if (isMonthlyPeriodType(period.periodType)) {
        return getMonthlyReferenceLabel(period.id)
    }

    if (isWeeklyPeriodType(period.periodType)) {
        return undefined
    }

    return period.id
}

const YEAR_SELECT_PAST_YEARS = 100
const YEAR_SELECT_FUTURE_YEARS = 25
const NEPALI_MIN_YEAR = 1971
const NEPALI_MAX_YEAR = 2099

const getYearFromPeriod = (period) =>
    period ? Number(period.id.substring(0, 4)) : undefined

const getBoundedYear = ({ year, minYear, maxYear, calendar }) => {
    let boundedYear = year

    if (calendar === 'nepali') {
        boundedYear = Math.max(NEPALI_MIN_YEAR, boundedYear)
        boundedYear = Math.min(NEPALI_MAX_YEAR, boundedYear)
    }

    if (minYear !== undefined) {
        boundedYear = Math.max(minYear, boundedYear)
    }

    if (maxYear !== undefined) {
        boundedYear = Math.min(maxYear, boundedYear)
    }

    return boundedYear
}

const getYearSelectOptions = ({ visibleYear, minYear, maxYear, calendar }) => {
    let startYear = visibleYear - YEAR_SELECT_PAST_YEARS
    let endYear = visibleYear + YEAR_SELECT_FUTURE_YEARS

    if (calendar === 'nepali') {
        startYear = Math.max(startYear, NEPALI_MIN_YEAR)
        endYear = Math.min(endYear, NEPALI_MAX_YEAR)
    }

    if (minYear !== undefined) {
        startYear = Math.max(startYear, minYear)
    }

    if (maxYear !== undefined) {
        endYear = Math.min(endYear, maxYear)
    }

    if (startYear > endYear) {
        const boundedYear = getBoundedYear({
            year: visibleYear,
            minYear,
            maxYear,
            calendar,
        })
        return [boundedYear]
    }

    return Array.from(
        { length: endYear - startYear + 1 },
        (_, index) => startYear + index
    )
}

const popperOffsetModifier = {
    name: 'offset',
    options: {
        offset: [0, 2],
    },
}

const focusTrigger = (trigger) => {
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => trigger.current?.focus())
        return
    }

    trigger.current?.focus()
}

export const PeriodPicker = ({
    value,
    periodType,
    calendar,
    locale = 'en',
    minPeriodId,
    maxPeriodId,
    referencePeriodId,
    isPeriodDisabled,
    disabled,
    error,
    placeholder = i18n.t('Select period'),
    ariaLabel = i18n.t('Select period'),
    dataTest,
    onChange,
}) => {
    const normalizedCalendar = normalizeDhis2Calendar(calendar)
    const anchorRef = useRef(null)
    const triggerRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [visibleYear, setVisibleYear] = useState(() =>
        getInitialVisibleYear({
            value,
            referencePeriodId,
            minPeriodId,
            maxPeriodId,
            calendar: normalizedCalendar,
        })
    )

    const selectedPeriod = useMemo(
        () =>
            value
                ? createFixedPeriodSafely({
                      periodId: value,
                      calendar: normalizedCalendar,
                      locale,
                  })
                : undefined,
        [normalizedCalendar, locale, value]
    )

    const minPeriod = useMemo(
        () =>
            minPeriodId
                ? createFixedPeriodSafely({
                      periodId: minPeriodId,
                      calendar: normalizedCalendar,
                      locale,
                  })
                : undefined,
        [normalizedCalendar, locale, minPeriodId]
    )

    const maxPeriod = useMemo(
        () =>
            maxPeriodId
                ? createFixedPeriodSafely({
                      periodId: maxPeriodId,
                      calendar: normalizedCalendar,
                      locale,
                  })
                : undefined,
        [normalizedCalendar, locale, maxPeriodId]
    )

    const minYear = getYearFromPeriod(minPeriod)
    const maxYear = getYearFromPeriod(maxPeriod)
    const boundedVisibleYear = getBoundedYear({
        year: visibleYear,
        minYear,
        maxYear,
        calendar: normalizedCalendar,
    })

    const periods = useMemo(() => {
        try {
            return generateFixedPeriods({
                year: boundedVisibleYear,
                periodType,
                calendar: normalizedCalendar,
                locale,
            })
        } catch {
            return []
        }
    }, [boundedVisibleYear, normalizedCalendar, locale, periodType])

    const yearOptions = useMemo(
        () =>
            getYearSelectOptions({
                visibleYear: boundedVisibleYear,
                minYear,
                maxYear,
                calendar: normalizedCalendar,
            }),
        [boundedVisibleYear, normalizedCalendar, maxYear, minYear]
    )

    useEffect(() => {
        if (boundedVisibleYear !== visibleYear) {
            setVisibleYear(boundedVisibleYear)
        }
    }, [boundedVisibleYear, visibleYear])

    useEffect(() => {
        const periodId = value || referencePeriodId
        if (!periodId) {
            return
        }

        const periodYear = getPeriodYear(periodId)
        if (periodYear === undefined) {
            return
        }

        setVisibleYear(
            getBoundedYear({
                year: periodYear,
                minYear,
                maxYear,
                calendar: normalizedCalendar,
            })
        )
    }, [maxYear, minYear, normalizedCalendar, referencePeriodId, value])

    const closeAndFocusTrigger = () => {
        setOpen(false)
        focusTrigger(triggerRef)
    }

    const handleEscapeKeyDown = (event) => {
        if (event.key !== 'Escape' || !open) {
            return
        }

        event.preventDefault()
        event.stopPropagation()
        event.nativeEvent?.stopImmediatePropagation?.()
        closeAndFocusTrigger()
    }

    const goToPreviousYear = () => {
        setVisibleYear((year) =>
            getBoundedYear({
                year: year - 1,
                minYear,
                maxYear,
                calendar: normalizedCalendar,
            })
        )
    }

    const goToNextYear = () => {
        setVisibleYear((year) =>
            getBoundedYear({
                year: year + 1,
                minYear,
                maxYear,
                calendar: normalizedCalendar,
            })
        )
    }

    const minNavigableYear = getBoundedYear({
        year: Number.NEGATIVE_INFINITY,
        minYear,
        maxYear,
        calendar: normalizedCalendar,
    })
    const maxNavigableYear = getBoundedYear({
        year: Number.POSITIVE_INFINITY,
        minYear,
        maxYear,
        calendar: normalizedCalendar,
    })
    const canNavigatePrevious =
        minNavigableYear === Number.NEGATIVE_INFINITY ||
        boundedVisibleYear > minNavigableYear
    const canNavigateNext =
        maxNavigableYear === Number.POSITIVE_INFINITY ||
        boundedVisibleYear < maxNavigableYear

    const periodIsDisabled = (period) => {
        if (minPeriod && compareFixedPeriods(period, minPeriod) < 0) {
            return true
        }

        if (maxPeriod && compareFixedPeriods(period, maxPeriod) > 0) {
            return true
        }

        return isPeriodDisabled?.(period) ?? false
    }

    const handleSelect = (period) => {
        if (periodIsDisabled(period)) {
            return
        }

        onChange(period)
        closeAndFocusTrigger()
    }

    const triggerLabel =
        getPeriodPrimaryLabel(selectedPeriod, normalizedCalendar, locale) ??
        placeholder
    const accessibleTriggerLabel = selectedPeriod
        ? `${ariaLabel}: ${triggerLabel}`
        : ariaLabel

    return (
        <div className={styles.container} ref={anchorRef}>
            <button
                type="button"
                ref={triggerRef}
                className={cx(styles.trigger, error && styles.triggerError)}
                disabled={disabled}
                aria-label={accessibleTriggerLabel}
                aria-expanded={open}
                data-test={dataTest}
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={handleEscapeKeyDown}
            >
                <span
                    className={
                        selectedPeriod
                            ? styles.triggerValue
                            : styles.placeholder
                    }
                >
                    {triggerLabel}
                </span>
                <IconChevronDown16 />
            </button>

            {open && (
                <Layer onBackdropClick={closeAndFocusTrigger}>
                    <Popper
                        reference={anchorRef}
                        placement="bottom-start"
                        modifiers={[popperOffsetModifier]}
                    >
                        <dialog
                            open
                            className={styles.popover}
                            aria-label={ariaLabel}
                            onKeyDown={handleEscapeKeyDown}
                        >
                            <div className={styles.header}>
                                <div className={styles.yearNavigation}>
                                    <div
                                        className={
                                            styles.yearNavigationPrevious
                                        }
                                    >
                                        <button
                                            type="button"
                                            className={styles.iconButton}
                                            aria-label={i18n.t('Previous year')}
                                            data-test={
                                                dataTest
                                                    ? `${dataTest}-previous-year`
                                                    : undefined
                                            }
                                            disabled={!canNavigatePrevious}
                                            onClick={goToPreviousYear}
                                        >
                                            <IconChevronLeft16 />
                                        </button>
                                    </div>
                                    <div className={styles.yearSelectWrapper}>
                                        <select
                                            className={styles.yearSelect}
                                            aria-label={i18n.t('Select year')}
                                            data-test={
                                                dataTest
                                                    ? `${dataTest}-visible-year`
                                                    : undefined
                                            }
                                            value={boundedVisibleYear}
                                            onChange={(event) =>
                                                setVisibleYear(
                                                    Number(event.target.value)
                                                )
                                            }
                                        >
                                            {yearOptions.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                        <IconChevronDown16
                                            className={styles.yearSelectIcon}
                                        />
                                    </div>
                                    <div className={styles.yearNavigationNext}>
                                        <button
                                            type="button"
                                            className={styles.iconButton}
                                            aria-label={i18n.t('Next year')}
                                            data-test={
                                                dataTest
                                                    ? `${dataTest}-next-year`
                                                    : undefined
                                            }
                                            disabled={!canNavigateNext}
                                            onClick={goToNextYear}
                                        >
                                            <IconChevronRight16 />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={
                                    isMonthlyPeriodType(periodType)
                                        ? styles.monthGrid
                                        : styles.weekList
                                }
                            >
                                {periods.map((period) => {
                                    const selected =
                                        selectedPeriod?.id === period.id
                                    const periodDisabled =
                                        periodIsDisabled(period)
                                    const secondaryLabel =
                                        getPeriodSecondaryLabel(period)
                                    const buttonClassName = cx(
                                        selected
                                            ? styles.periodButtonSelected
                                            : styles.periodButton,
                                        !secondaryLabel &&
                                            styles.periodButtonSingleLine
                                    )

                                    return (
                                        <button
                                            type="button"
                                            key={period.id}
                                            className={buttonClassName}
                                            disabled={periodDisabled}
                                            aria-pressed={selected}
                                            title={getPeriodPrimaryLabel(
                                                period,
                                                normalizedCalendar,
                                                locale
                                            )}
                                            data-test={
                                                dataTest
                                                    ? `${dataTest}-option-${period.id}`
                                                    : undefined
                                            }
                                            onClick={() => handleSelect(period)}
                                        >
                                            <span className={styles.periodName}>
                                                {getPeriodCellPrimaryLabel(
                                                    period,
                                                    normalizedCalendar,
                                                    locale
                                                )}
                                            </span>
                                            {secondaryLabel && (
                                                <span
                                                    className={styles.periodId}
                                                >
                                                    {secondaryLabel}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </dialog>
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

const fixedPeriodShape = PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    name: PropTypes.string,
})

PeriodPicker.propTypes = {
    calendar: PropTypes.string.isRequired,
    periodType: PropTypes.oneOf([WEEKLY, MONTHLY]).isRequired,
    onChange: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    isPeriodDisabled: PropTypes.func,
    locale: PropTypes.string,
    maxPeriodId: PropTypes.string,
    minPeriodId: PropTypes.string,
    placeholder: PropTypes.string,
    referencePeriodId: PropTypes.string,
    value: PropTypes.string,
}

PeriodPicker.fixedPeriodShape = fixedPeriodShape

export default PeriodPicker
