import { Provider as DataProvider } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import RunConfigModal from './RunConfigModal.jsx'

const baseConfig = {
    id: 'cfg-1',
    name: 'Monthly Temperature',
    dataset: {
        id: 'ERA5/TEMP',
        name: 'Temperature (ERA5-Land)',
        provider: { id: 'test' },
        supportedPeriodTypes: [{ periodType: 'MONTHLY' }],
    },
    datasetId: 'ERA5/TEMP',
    datasetName: 'Temperature (ERA5-Land)',
    dataElement: { id: 'deId1', displayName: 'Min Temperature' },
    orgUnits: [{ id: 'ou1', name: 'Bo' }],
    featureCount: 1,
    periodType: 'MONTHLY',
    dataUpdatedThrough: null,
    lastRunAt: null,
    createdAt: '2026-01-01T12:00:00.000Z',
    createdByName: 'Test User',
}

// A valid Point geoFeature that toGeoJson will accept
const singleFeature = {
    id: 'ou1',
    co: '[10, 8]',
    ty: 1,
    le: 3,
    na: 'Bo',
    hcd: false,
    hcu: false,
    pg: '/Sierra Leone/Southern',
    pi: 'p1',
    pn: 'Southern',
}

const mockAppConfig = { baseUrl: 'http://localhost:8080', apiVersion: 42 }

const TestWrapper = ({ children }) => (
    <DataProvider config={mockAppConfig}>{children}</DataProvider>
)
TestWrapper.propTypes = { children: PropTypes.node.isRequired }

const setupIntercepts = ({
    serverTimeZoneId = 'Etc/UTC',
    geoFeaturesBody = [singleFeature],
    geoFeaturesStatus = 200,
} = {}) => {
    cy.intercept('GET', '**/api/*/me?fields=*', {
        statusCode: 200,
        body: {
            id: 'userId1',
            username: 'admin',
            displayName: 'Admin User',
            settings: { keyAnalysisDisplayProperty: 'name' },
        },
    }).as('getUser')

    cy.intercept('GET', '**/api/*/system/info?fields=*', {
        statusCode: 200,
        body: { serverTimeZoneId },
    }).as('getSystemInfo')

    cy.intercept('GET', '**/api/*/userSettings*', {
        statusCode: 200,
        body: { keyUiLocale: 'en' },
    }).as('getUserSettings')

    cy.intercept('GET', '**/api/*/geoFeatures*', {
        statusCode: geoFeaturesStatus,
        body: geoFeaturesBody,
    }).as('getGeoFeatures')
}

const mount = (config = baseConfig) => {
    console.log('jj test mount')
    const onClose = cy.stub().as('onClose')
    const onRunComplete = cy.stub().as('onRunComplete')
    cy.mount(
        <TestWrapper>
            <RunConfigModal
                config={config}
                onClose={onClose}
                onRunComplete={onRunComplete}
            />
        </TestWrapper>
    )
    return { onClose, onRunComplete }
}

describe('RunConfigModal', () => {
    beforeEach(() => {
        setupIntercepts()
    })

    describe('summary display', () => {
        it('shows the config name in the modal title', () => {
            mount()
            cy.contains('Import "Monthly Temperature"').should('be.visible')
        })

        it('shows the data source name', () => {
            mount()
            cy.contains('Temperature (ERA5-Land)').should('be.visible')
        })

        it('shows the data element display name', () => {
            mount()
            cy.contains('Min Temperature').should('be.visible')
        })

        it('shows the org unit name', () => {
            mount()
            cy.contains('Bo').should('be.visible')
        })

        it('falls back to datasetName when dataset object is not hydrated', () => {
            mount({ ...baseConfig, dataset: undefined })
            cy.contains('Temperature (ERA5-Land)').should('be.visible')
        })
    })

    describe('date range display', () => {
        it('shows a plain date range when there is no import history', () => {
            mount()
            cy.contains('Since last import').should('not.exist')
        })

        it('shows "Since last import" prefix when dataUpdatedThrough is set', () => {
            mount({ ...baseConfig, dataUpdatedThrough: '2026-01-31' })
            cy.contains('Since last import').should('be.visible')
        })

        it('shows the Change button', () => {
            mount()
            cy.contains('button', 'Change').should('be.visible')
        })
    })

    describe('editing the date range', () => {
        it('shows date inputs when Change is clicked', () => {
            mount()
            cy.contains('button', 'Change').click()
            cy.getByDataTest('start-date-input').should('be.visible')
            cy.getByDataTest('end-date-input').should('be.visible')
        })

        it('replaces the Change button with Done and Use default range while editing', () => {
            mount()
            cy.contains('button', 'Change').click()
            cy.contains('button', 'Done').should('be.visible')
            cy.contains('button', 'Use default range').should('be.visible')
            cy.contains('button', 'Change').should('not.exist')
        })

        it('closes the editor when Done is clicked', () => {
            mount()
            cy.contains('button', 'Change').click()
            cy.contains('button', 'Done').click()
            cy.getByDataTest('start-date-input').should('not.exist')
        })

        it('drops the "Since last import" prefix after the range is edited', () => {
            mount({ ...baseConfig, dataUpdatedThrough: '2026-01-31' })
            cy.contains('Since last import').should('be.visible')
            cy.contains('button', 'Change').click()
            cy.contains('button', 'Done').click()
            cy.contains('Since last import').should('not.exist')
        })

        it('restores "Since last import" and closes the editor after Use default range', () => {
            mount({ ...baseConfig, dataUpdatedThrough: '2026-01-31' })
            cy.contains('button', 'Change').click()
            cy.contains('button', 'Use default range').click()
            cy.contains('Since last import').should('be.visible')
            cy.getByDataTest('start-date-input').should('not.exist')
        })

        it('shows an error and disables Done when start date is after end date', () => {
            mount()
            cy.contains('button', 'Change').click()
            cy.getByDataTest('start-date-input').within(() => {
                cy.get('input').clear()
                cy.get('input').type('2099-01-01')
                cy.get('input').blur()
            })
            cy.contains('Start date must be on or before the end date.').should(
                'be.visible'
            )
            cy.contains('button', 'Done').should('be.disabled')
        })
    })

    describe('TimeZone', () => {
        it('shows a read-only Time zone row in the summary when config.timeZone is set', () => {
            mount({ ...baseConfig, timeZone: 'Africa/Freetown' })
            cy.contains('Time zone').should('be.visible')
            cy.contains('Africa/Freetown').should('be.visible')
        })

        it('does not show a Time zone row when config.timeZone is not set', () => {
            mount()
            cy.contains('Time zone').should('not.exist')
        })

        it('does not show an editable timezone selector in the date editor', () => {
            // Even when the dataset has a timeZone and the server is non-UTC,
            // the selector must not appear — the saved timezone is fixed.
            setupIntercepts({
                serverTimeZoneId: 'Africa/Freetown',
                geoFeaturesBody: [singleFeature],
            })
            const configWithTz = {
                ...baseConfig,
                timeZone: 'Africa/Freetown',
                dataset: { ...baseConfig.dataset, timeZone: {} },
            }
            mount(configWithTz)
            cy.wait('@getSystemInfo')
            cy.contains('button', 'Change').click()
            cy.getByDataTest('time-zone-select').should('not.exist')
        })
    })

    describe('notices', () => {
        it('shows a warning when no org unit geometries are found', () => {
            setupIntercepts({ geoFeaturesBody: [] })
            mount()
            cy.wait('@getGeoFeatures')
            cy.contains('No org unit geometries found').should('be.visible')
        })

        it('shows an error notice when geoFeatures fails to load', () => {
            setupIntercepts({
                geoFeaturesStatus: 500,
                geoFeaturesBody: { httpStatus: 'Internal Server Error' },
            })
            mount()
            cy.wait('@getGeoFeatures')
            cy.contains('Failed to load org unit geometries').should(
                'be.visible'
            )
        })

        it('shows a warning when the value count exceeds 50,000', () => {
            // 1000 org units × ~70 monthly periods since 2020 > 50,000
            mount({
                ...baseConfig,
                featureCount: 1000,
                dataUpdatedThrough: '2020-01-01',
            })
            cy.contains('Range exceeds the').should('be.visible')
        })
    })

    describe('Start import button', () => {
        it.only('is disabled while org unit features are loading', () => {
            cy.intercept('GET', '**/api/*/geoFeatures*', (req) => {
                req.reply({ delay: 3000, body: [singleFeature] })
            }).as('getGeoFeaturesDelayed')
            mount()
            // Wait for user info so the loading state is triggered
            cy.wait('@getSystemInfo')
            cy.contains('button', 'Start import').should('be.disabled')
        })

        it('is disabled when no org unit geometries are found', () => {
            setupIntercepts({ geoFeaturesBody: [] })
            mount()
            cy.wait('@getGeoFeatures')
            cy.contains('button', 'Start import').should('be.disabled')
        })

        it('is disabled when features fail to load', () => {
            setupIntercepts({
                geoFeaturesStatus: 500,
                geoFeaturesBody: { httpStatus: 'Internal Server Error' },
            })
            mount()
            cy.wait('@getGeoFeatures')
            cy.contains('button', 'Start import').should('be.disabled')
        })

        it('is disabled when the value count exceeds the limit', () => {
            mount({
                ...baseConfig,
                featureCount: 1000,
                dataUpdatedThrough: '2020-01-01',
            })
            cy.wait('@getGeoFeatures')
            cy.contains('button', 'Start import').should('be.disabled')
        })

        it('is disabled when the date range is invalid', () => {
            mount()
            cy.contains('button', 'Change').click()
            cy.getByDataTest('start-date-input').within(() => {
                cy.get('input').clear()
                cy.get('input').type('2099-01-01')
                cy.get('input').blur()
            })
            cy.contains('button', 'Start import').should('be.disabled')
        })

        it('is enabled once features are loaded and the range is valid', () => {
            mount()
            cy.wait('@getGeoFeatures')
            cy.contains('button', 'Start import').should('not.be.disabled')
        })

        it('transitions to ImportModal when clicked', () => {
            mount()
            cy.wait('@getGeoFeatures')
            cy.contains('button', 'Start import').click()
            cy.contains('Importing climate data').should('be.visible')
        })
    })

    describe('Cancel button', () => {
        it('calls onClose when Cancel is clicked', () => {
            mount()
            cy.contains('button', 'Cancel').click()
            cy.get('@onClose').should('have.been.calledOnce')
        })
    })
})
