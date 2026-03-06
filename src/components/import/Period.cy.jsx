import { Provider as DataProvider } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import Period from './Period.jsx'

describe('Period', () => {
    const defaultPeriod = {
        periodType: 'DAILY',
        startTime: '2026-01-03',
        endTime: '2026-01-29',
        calendar: 'gregory',
        locale: 'en',
    }

    let mockOnChange
    let mockOnChangeType

    // Mock DHIS2 app configuration
    const mockAppConfig = {
        baseUrl: 'http://localhost:8080',
        apiVersion: 42,
    }

    // Wrapper component to provide DHIS2 context
    const TestWrapper = ({ children }) => (
        <DataProvider config={mockAppConfig}>{children}</DataProvider>
    )

    TestWrapper.propTypes = {
        children: PropTypes.node.isRequired,
    }

    // Helper function to set up API intercepts with configurable timezone
    const setupApiIntercepts = (timeZoneId = 'Etc/UTC') => {
        cy.intercept('GET', '**/api/*/me?fields=*', {
            statusCode: 200,
            body: {
                id: 'test-user',
                username: 'testuser',
                displayName: 'Test User',
                settings: {
                    keyUiLocale: 'en',
                },
            },
        }).as('getUserInfo')

        cy.intercept('GET', '**/api/*/system/info?fields=*', {
            statusCode: 200,
            body: {
                serverTimeZoneId: timeZoneId,
            },
        }).as('getSystemInfo')

        cy.intercept('GET', '**/api/*/userSettings*', {
            statusCode: 200,
            body: {
                keyUiLocale: 'en',
            },
        }).as('getUserSettings')
    }

    beforeEach(() => {
        // Create stubs for each test
        mockOnChange = cy.stub().as('onChange')
        mockOnChangeType = cy.stub().as('onChangeType')

        // Set up API intercepts with default UTC timezone
        setupApiIntercepts('Etc/UTC')
    })

    describe('Help text for datasets without timezone', () => {
        const dataset = {
            supportedPeriodTypes: [
                { periodType: 'DAILY' },
                { periodType: 'WEEKLY' },
                { periodType: 'MONTHLY' },
            ],
        }

        it('shows weekly help text for weekly period type', () => {
            const period = { ...defaultPeriod, periodType: 'WEEKLY' }
            cy.mount(
                <TestWrapper>
                    <Period
                        period={period}
                        dataset={dataset}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.contains(
                'Data for full calendar weeks inclusive of start and end dates will be aggregated to weekly values.'
            ).should('be.visible')
        })

        it('shows monthly help text for monthly period type', () => {
            const period = { ...defaultPeriod, periodType: 'MONTHLY' }
            cy.mount(
                <TestWrapper>
                    <Period
                        period={period}
                        dataset={dataset}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.contains(
                'Data for full calendar months inclusive of start and end dates will be aggregated to monthly values.'
            ).should('be.visible')
        })

        it('shows generic help text for daily period type', () => {
            cy.mount(
                <TestWrapper>
                    <Period
                        period={defaultPeriod}
                        dataset={dataset}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.contains(
                'Data between start and end date will be imported as daily values.'
            ).should('be.visible')
            // TimeZone should not be shown for datasets without timezone
            cy.getByDataTest('time-zone-select').should('not.exist')
        })
    })

    describe('Help text for datasets with timezone', () => {
        const datasetWithTimeZone = {
            timeZone: {},
            supportedPeriodTypes: [
                { periodType: 'DAILY' },
                { periodType: 'WEEKLY' },
                { periodType: 'MONTHLY' },
            ],
        }

        beforeEach(() => {
            // Set up API intercepts with Africa/Freetown timezone for these tests
            setupApiIntercepts('Africa/Freetown')
        })

        it('shows weekly help text with hourly data mention', () => {
            const period = { ...defaultPeriod, periodType: 'WEEKLY' }
            cy.mount(
                <TestWrapper>
                    <Period
                        period={period}
                        dataset={datasetWithTimeZone}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.contains(
                'Weekly data for full calendar weeks inclusive of start and end dates will be aggregated from hourly data.'
            ).should('be.visible')
            // TimeZone component should be shown
            cy.getByDataTest('time-zone-select').should('be.visible')
            cy.getByDataTest('time-zone-select').should(
                'contain.text',
                'Etc/UTC'
            )
            cy.getByDataTest('time-zone-select').click()
            cy.contains('Africa/Freetown').should('be.visible')
        })

        it('shows monthly help text with hourly data mention', () => {
            const period = { ...defaultPeriod, periodType: 'MONTHLY' }
            cy.mount(
                <TestWrapper>
                    <Period
                        period={period}
                        dataset={datasetWithTimeZone}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.contains(
                'Monthly data for full calendar months inclusive of start and end dates will be aggregated from hourly data.'
            ).should('be.visible')
        })

        it('shows timezone adjustment note when not UTC', () => {
            cy.mount(
                <TestWrapper>
                    <Period
                        period={defaultPeriod}
                        dataset={datasetWithTimeZone}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.contains(
                'Time zone adjustments will be applied if the selected time zone is not set to UTC.'
            ).should('be.visible')
            // TimeZone component should be shown with Africa/Freetown
            cy.getByDataTest('time-zone-select').should('be.visible')
            cy.getByDataTest('time-zone-select').should(
                'contain.text',
                'Etc/UTC'
            )
            cy.getByDataTest('time-zone-select').click()
            cy.contains('Africa/Freetown').should('be.visible')
        })

        it('does not show timezone adjustment note when UTC', () => {
            // Override with UTC timezone for this test
            cy.intercept('GET', '**/api/*/system/info?fields=*', {
                statusCode: 200,
                body: {
                    serverTimeZoneId: 'Etc/UTC',
                },
            }).as('getSystemInfo')

            const datasetUTC = {
                timeZone: {},
                supportedPeriodTypes: [
                    { periodType: 'DAILY' },
                    { periodType: 'WEEKLY' },
                    { periodType: 'MONTHLY' },
                ],
            }

            cy.mount(
                <TestWrapper>
                    <Period
                        period={defaultPeriod}
                        dataset={datasetUTC}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.contains('Time zone adjustments will be applied').should(
                'not.exist'
            )
            cy.getByDataTest('time-zone-select').should('not.exist')
        })
    })

    describe('Period type selector', () => {
        const dataset = {
            supportedPeriodTypes: [
                { periodType: 'DAILY' },
                { periodType: 'WEEKLY' },
                { periodType: 'MONTHLY' },
            ],
        }

        beforeEach(() => {
            // Set up API intercepts for these tests
            setupApiIntercepts('Etc/UTC')
        })

        it('renders period type selector', () => {
            cy.mount(
                <TestWrapper>
                    <Period
                        period={defaultPeriod}
                        dataset={dataset}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.getByDataTest('period-type-selector').should('be.visible')
        })

        it('renders start and end date inputs', () => {
            cy.mount(
                <TestWrapper>
                    <Period
                        period={defaultPeriod}
                        dataset={dataset}
                        onChange={mockOnChange}
                        onChangeType={mockOnChangeType}
                    />
                </TestWrapper>
            )
            cy.wait('@getSystemInfo')
            cy.getByDataTest('start-date-input').should('be.visible')
            cy.getByDataTest('end-date-input').should('be.visible')
        })
    })
})
