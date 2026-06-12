const DATASTORE_URL = '**/api/*/dataStore/CLIMATE_DATA/recurringImports'

const MOCK_CONFIG_ID = 'test-config-id-1'
const MOCK_CONFIG_NAME = 'Weekly Precipitation SL'

const MOCK_CONFIG = {
    id: MOCK_CONFIG_ID,
    name: MOCK_CONFIG_NAME,
    datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum',
    datasetName: 'Precipitation (ERA5-Land)',
    dataElement: {
        id: 'fbfJHSPpUQD',
        displayName: 'IDSR Malaria',
    },
    orgUnits: [
        { id: 'O6uvpzGd5pu', name: 'Connaught Hospital' },
        { id: 'kJq2mPyFpX8', name: 'Rokupa Government Hospital' },
    ],
    featureCount: 13,
    periodType: 'WEEKLY',
    dataUpdatedThrough: null,
    lastRunAt: '2026-05-29T13:34:41.103Z',
    createdAt: '2026-01-01T12:00:00.000Z',
    createdByName: 'Test User',
}

const interceptDataValueSets = () => {
    cy.intercept('POST', '**/api/*/dataValueSets*', (req) => {
        req.reply({
            statusCode: 200,
            body: {
                status: 'SUCCESS',
                importCount: { imported: req.body.dataValues?.length ?? 0 },
            },
        })
    }).as('postDataValueSets')
}

const selectDataset = (datasetName) => {
    cy.getByDataTest('dataset-selector-content').click()
    cy.contains(datasetName).should('be.visible')
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .should('have.length.greaterThan', 1)
        .contains(datasetName)
        .click()
}

const selectPeriodType = (periodType) => {
    cy.getByDataTest('period-type-selector').containsExact(periodType).click()
    cy.getByDataTest('period-type-selector')
        .containsExact(periodType)
        .find('input[type="radio"]')
        .should('be.checked')
}

const selectTargetDataElement = (dataElementName) => {
    cy.getByDataTest('data-element-select').click()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .should('have.length.greaterThan', 1)
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .contains(dataElementName)
        .scrollIntoView()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .contains(dataElementName)
        .click()
}

const typeStartAndEndDates = (startDate, endDate) => {
    cy.getByDataTest('start-date-input-content').scrollIntoView()
    cy.getByDataTest('start-date-input-content').find('input').clear()
    cy.getByDataTest('start-date-input-content').find('input').type(startDate)
    cy.getByDataTest('end-date-input-content').find('input').clear()
    cy.getByDataTest('end-date-input-content').find('input').type(endDate)
    cy.getByDataTest('end-date-input-content').find('input').blur()
}

const fillImportForm = () => {
    cy.visit('#/import/new')
    selectDataset('Earth Engine: Precipitation (ERA5-Land)')
    selectPeriodType('Weekly')
    selectTargetDataElement('IDSR Malaria (weekly)')
    typeStartAndEndDates('2026-01-14', '2026-01-29')
}

describe('Save import', () => {
    it('shows one-time import as the default selection', () => {
        cy.visit('#/import/new')

        cy.contains('Save this import?').scrollIntoView()
        cy.contains('Save this import?').should('be.visible')

        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('One-time import')
            .find('input[type="radio"]')
            .should('be.checked')

        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('Save this import')
            .find('input[type="radio"]')
            .should('not.be.checked')

        cy.contains('Import name').should('not.exist')
        cy.get('button').contains('Import once').should('exist')
    })

    it('switching to "Save this import" shows import name field and changes button text', () => {
        cy.visit('#/import/new')

        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('Save this import')
            .scrollIntoView()
        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('Save this import')
            .click()

        cy.contains('Import name').scrollIntoView()
        cy.contains('Import name').should('be.visible')
        cy.get('button').contains('Save & import').scrollIntoView()
        cy.get('button').contains('Save & import').should('exist')

        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('One-time import')
            .click()
        cy.contains('Import name').should('not.exist')
        cy.get('button').contains('Import once').should('exist')
    })

    it('saves the import configuration to the dataStore and shows confirmation', () => {
        cy.intercept('GET', DATASTORE_URL, { statusCode: 404 }).as(
            'getDataStore'
        )
        cy.intercept('POST', DATASTORE_URL, (req) => {
            req.reply({ status: 'OK' })
        }).as('postDataStore')
        cy.intercept('PUT', DATASTORE_URL, { status: 'OK' }).as('putDataStore')
        interceptDataValueSets()

        fillImportForm()

        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('Save this import')
            .scrollIntoView()
        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('Save this import')
            .click()

        // Auto-suggested name should be pre-filled
        cy.getByDataTest('import-name-input').scrollIntoView()
        cy.getByDataTest('import-name-input')
            .find('input')
            .should('not.have.value', '')

        cy.contains('button', 'Save & import').scrollIntoView()
        cy.contains('button', 'Save & import').should('not.be.disabled')
        cy.contains('button', 'Save & import').click()

        cy.wait('@postDataStore')
            .its('request.body.configs')
            .should('have.length', 1)

        cy.wait('@postDataValueSets', { timeout: 60000 })

        cy.contains('Saved as').should('be.visible')
        cy.contains('View in Imports →').should('be.visible')

        cy.wait('@putDataStore')
    })

    it('saves with a custom import name', () => {
        cy.intercept('GET', DATASTORE_URL, { statusCode: 404 }).as(
            'getDataStore'
        )
        cy.intercept('POST', DATASTORE_URL, (req) => {
            expect(req.body.configs[0].name).to.equal('My Custom Import')
            req.reply({ status: 'OK' })
        }).as('postDataStore')
        cy.intercept('PUT', DATASTORE_URL, { status: 'OK' }).as('putDataStore')
        interceptDataValueSets()

        fillImportForm()

        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('Save this import')
            .scrollIntoView()
        cy.getByDataTest('dhis2-uicore-radio')
            .containsExact('Save this import')
            .click()

        cy.getByDataTest('import-name-input').scrollIntoView()
        cy.getByDataTest('import-name-input').find('input').clear()
        cy.getByDataTest('import-name-input')
            .find('input')
            .type('My Custom Import')

        cy.contains('button', 'Save & import').scrollIntoView()
        cy.contains('button', 'Save & import').should('not.be.disabled')
        cy.contains('button', 'Save & import').click()

        cy.wait('@postDataStore')
        cy.wait('@postDataValueSets', { timeout: 60000 })

        cy.contains('Saved as "My Custom Import"').should('be.visible')
    })
})

describe('Imports overview', () => {
    it('shows empty state when no imports are saved', () => {
        cy.intercept('GET', DATASTORE_URL, { statusCode: 404 }).as(
            'getDataStore'
        )
        cy.visit('#/import')

        cy.contains('Saved imports').should('be.visible')
        cy.contains("You haven't saved any imports yet.").should('be.visible')
    })

    it('shows saved imports list with correct metadata', () => {
        cy.intercept('GET', DATASTORE_URL, { configs: [MOCK_CONFIG] }).as(
            'getDataStore'
        )
        cy.visit('#/import')

        cy.contains(MOCK_CONFIG_NAME).should('be.visible')
        cy.contains('Last run').should('be.visible')
        cy.contains('Weekly · 13 org units').should('be.visible')
    })

    it('opens run modal with correct config info when Import… is clicked', () => {
        cy.intercept('GET', DATASTORE_URL, { configs: [MOCK_CONFIG] }).as(
            'getDataStore'
        )
        cy.visit('#/import')

        cy.contains('button', 'Import…', { timeout: 10000 }).should(
            'not.be.disabled'
        )
        cy.contains('button', 'Import…').click()

        cy.contains(`Import "${MOCK_CONFIG_NAME}"`).should('be.visible')
        cy.contains('Precipitation (ERA5-Land)').should('be.visible')
        cy.contains('IDSR Malaria').should('be.visible')
    })

    it('shows the saved timezone as read-only in the run modal', () => {
        const configWithTz = {
            id: 'test-config-tz-1',
            name: 'Daily Precipitation SL',
            datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum',
            datasetName: 'Precipitation (ERA5-Land)',
            dataElement: {
                id: 'fbfJHSPpUQD',
                displayName: 'IDSR Malaria',
            },
            orgUnits: [
                { id: 'O6uvpzGd5pu', name: 'Connaught Hospital' },
                { id: 'kJq2mPyFpX8', name: 'Rokupa Government Hospital' },
            ],
            featureCount: 13,
            periodType: 'DAILY',
            timeZone: 'Africa/Nairobi',
            dataUpdatedThrough: '2026-04-30',
            lastRunAt: '2026-05-01T10:00:00.000Z',
            createdAt: '2026-01-01T12:00:00.000Z',
            createdByName: 'Test User',
        }

        cy.intercept('GET', DATASTORE_URL, {
            configs: [configWithTz],
        }).as('getDataStore')
        cy.visit('#/import')

        cy.contains('button', 'Import…', { timeout: 10000 }).should(
            'not.be.disabled'
        )
        cy.contains('button', 'Import…').click()

        cy.contains('Import "Daily Precipitation SL"').should('be.visible')
        cy.contains('Time zone').should('be.visible')
        cy.contains('Africa/Nairobi').should('be.visible')
    })

    it('runs a saved import from the overview', () => {
        cy.intercept('GET', DATASTORE_URL, { configs: [MOCK_CONFIG] }).as(
            'getDataStore'
        )
        cy.intercept('PUT', DATASTORE_URL, { status: 'OK' }).as('putDataStore')
        interceptDataValueSets()

        cy.visit('#/import')

        cy.contains('button', 'Import…', { timeout: 10000 }).should(
            'not.be.disabled'
        )
        cy.contains('button', 'Import…').click()

        cy.contains(`Import "${MOCK_CONFIG_NAME}"`).should('be.visible')

        cy.contains('button', 'Start import').should('not.be.disabled')
        cy.contains('button', 'Start import').click()

        cy.wait('@postDataValueSets', { timeout: 60000 })

        cy.contains('button', 'Close').should('not.be.disabled')
        cy.contains('button', 'Close').click()

        cy.wait('@putDataStore')
    })

    it('updates the last import date on the card after running with changed dates', () => {
        cy.intercept('GET', DATASTORE_URL, { configs: [MOCK_CONFIG] }).as(
            'getDataStore'
        )
        cy.intercept('PUT', DATASTORE_URL, { status: 'OK' }).as('putDataStore')
        interceptDataValueSets()

        cy.visit('#/import')

        cy.contains('button', 'Import…', { timeout: 10000 }).should(
            'not.be.disabled'
        )
        cy.contains('button', 'Import…').click()

        cy.contains(`Import "${MOCK_CONFIG_NAME}"`).should('be.visible')

        cy.contains('button', 'Change').click()

        cy.getByDataTest('end-date-input').find('input').clear()
        cy.getByDataTest('end-date-input').find('input').type('2026-05-07')

        cy.contains('button', 'Done').click()

        cy.contains('button', 'Start import').should('not.be.disabled')
        cy.contains('button', 'Start import').click()

        cy.wait('@postDataValueSets', { timeout: 60000 })

        cy.contains('button', 'Close').should('not.be.disabled')
        cy.contains('button', 'Close').click()

        cy.wait('@putDataStore').then((interception) => {
            const config = interception.request.body.configs[0]
            expect(config.dataUpdatedThrough).to.eq('2026-05-07')
        })

        cy.contains('Data imported through').should('be.visible')
        cy.contains('May 7, 2026').should('be.visible')
    })

    it('deletes a saved import', () => {
        cy.intercept('GET', DATASTORE_URL, { configs: [MOCK_CONFIG] }).as(
            'getDataStore'
        )
        cy.intercept('PUT', DATASTORE_URL, (req) => {
            expect(req.body.configs).to.have.length(0)
            req.reply({ status: 'OK' })
        }).as('putDataStore')

        cy.visit('#/import')
        cy.contains(MOCK_CONFIG_NAME).should('be.visible')

        cy.get('[aria-label="More actions"]').click()
        cy.contains('Delete').click()

        cy.contains(`Delete "${MOCK_CONFIG_NAME}"?`).should('be.visible')
        cy.getByDataTest('dhis2-uicore-modal')
            .contains('button', 'Delete')
            .click()

        cy.wait('@putDataStore')
        cy.contains(MOCK_CONFIG_NAME).should('not.exist')
    })

    it('renames a saved import', () => {
        cy.intercept('GET', DATASTORE_URL, { configs: [MOCK_CONFIG] }).as(
            'getDataStore'
        )
        cy.intercept('PUT', DATASTORE_URL, (req) => {
            expect(req.body.configs[0].name).to.equal('Renamed Import')
            req.reply({ status: 'OK' })
        }).as('putDataStore')

        cy.visit('#/import')

        cy.get('[aria-label="Rename"]').click()
        cy.get('article').find('input[type="text"]').clear()
        cy.get('article')
            .find('input[type="text"]')
            .type('Renamed Import{enter}')

        cy.wait('@putDataStore')
        cy.contains('Renamed Import').should('be.visible')
        cy.contains(MOCK_CONFIG_NAME).should('not.exist')
    })
})
