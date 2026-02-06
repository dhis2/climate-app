import { getApiBaseUrl } from '../support/utils.js'

const geeResponse500 = {
    httpStatus: 'Internal Server Error',
    statusCode: 500,
    httpStatusCode: 500,
    status: 'ERROR',
    message: 'No value present',
}

const getRoutesFixture = () => ({
    routes: [
        {
            code: 'enacts',
            url: 'http://168.253.224.242:9091/dst/**',
            displayName: 'ENACTS API',
            href: `${getApiBaseUrl()}/api/routes/tdsabC1MCfI`,
            id: 'tdsabC1MCfI',
        },
    ],
})

const assertOrgUnitSection = () => {
    cy.contains('Select organisation units').scrollIntoView()
    cy.contains('Select organisation units').should('be.visible')
    cy.getByDataTest('org-unit-tree').should('be.visible')
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

const selectOrgUnitGroup = (groupName) => {
    cy.getByDataTest('org-unit-group-select').click()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .should('have.length.greaterThan', 1)
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .contains(groupName)
        .click()
    cy.getByDataTest('dhis2-uicore-popper').closePopper()
}

const selectTargetDataElement = (dataElementName) => {
    // Check that data elements are now available
    cy.getByDataTest('data-element-select').click()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .should('have.length.greaterThan', 1)
    cy.contains('No data elements found for the selected period type.').should(
        'not.exist'
    )

    // Select the data element
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
    // Type the start date directly into the input, ignoring the calendar popup
    cy.getByDataTest('start-date-input-content').find('input').clear()
    cy.getByDataTest('start-date-input-content').find('input').type(startDate)

    // Type the end date directly into the input, ignoring the calendar popup
    cy.getByDataTest('end-date-input-content').find('input').clear()
    cy.getByDataTest('end-date-input-content').find('input').type(endDate)
}

describe('Import', () => {
    it('should inform no datasets available when Enacts and GEE are not configured', () => {
        cy.intercept('**/api/*/tokens/google', geeResponse500).as('getGeeToken')

        cy.intercept('GET', '**/api/*/routes?fields=id*', {
            statusCode: 200,
            body: {
                routes: [],
            },
        }).as('getRoutes')

        cy.visit('#/import')

        cy.wait('@getGeeToken', { timeout: 30000 })
        cy.wait('@getRoutes', { timeout: 30000 })

        cy.contains('Select dataset to import').should('be.visible')
        cy.getByDataTest('dataset-selector-content')
            .should('be.visible')
            .click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length', 1)
        cy.contains('No datasets are available.').should('be.visible')
        cy.getByDataTest('dhis2-uicore-popper').closePopper()
        assertOrgUnitSection()
    })

    it('should show only GEE datasets when GEE is configured and Enacts is not', () => {
        cy.intercept('GET', '**/api/*/routes?fields=id*', {
            statusCode: 200,
            body: {
                routes: [],
            },
        }).as('getRoutes')

        cy.visit('#/import')

        cy.wait('@getRoutes')

        cy.contains('Select dataset to import').should('be.visible')
        cy.getByDataTest('dataset-selector-content')
            .should('be.visible')
            .click()
        cy.contains('Earth Engine: Air temperature (ERA5-Land)').should(
            'be.visible'
        )
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length', 34)
    })

    it('should show only Enacts datasets when Enacts is configured and GEE is not', () => {
        cy.intercept('**/api/*/tokens/google', geeResponse500).as('getGeeToken')
        cy.intercept(
            'GET',
            '**/api/*/routes?fields=id*',
            getRoutesFixture()
        ).as('getRoutes')

        cy.intercept('GET', '**/api/routes/*/run/info', {
            fixture: 'enactsInfo.json',
        }).as('getEnactsInfo')

        cy.intercept('GET', '**/api/routes/*/run/dataset_info', {
            fixture: 'enactsDatasetInfo.json',
        }).as('getEnactsDatasetInfo')

        cy.visit('#/import')

        cy.wait('@getGeeToken')
        cy.wait('@getRoutes')
        cy.wait('@getEnactsInfo')
        cy.wait('@getEnactsDatasetInfo')

        cy.contains('Select dataset to import').should('be.visible')
        cy.getByDataTest('dataset-selector-content')
            .should('be.visible')
            .click()
        cy.contains('Earth Engine: Air temperature (ERA5-Land)').should(
            'not.exist'
        )
        cy.contains('ENACTS: All stations - Rainfall').should('be.visible')
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length', 5)
    })

    it('should show both Enacts and GEE datasets when both are configured', () => {
        cy.intercept(
            'GET',
            '**/api/*/routes?fields=id*',
            getRoutesFixture()
        ).as('getRoutes')

        cy.intercept('GET', '**/api/routes/*/run/info', {
            fixture: 'enactsInfo.json',
        }).as('getEnactsInfo')

        cy.intercept('GET', '**/api/routes/*/run/dataset_info', {
            fixture: 'enactsDatasetInfo.json',
        }).as('getEnactsDatasetInfo')

        cy.visit('#/import')

        cy.wait('@getRoutes')
        cy.wait('@getEnactsInfo')
        cy.wait('@getEnactsDatasetInfo')

        cy.contains('Select dataset to import').should('be.visible')
        cy.getByDataTest('dataset-selector-content')
            .should('be.visible')
            .click()

        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length', 38)

        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper').scrollTo('top')
        cy.contains('ENACTS: All stations - Rainfall').should('be.visible')

        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper').scrollTo(
            'bottom'
        )
        cy.contains('Earth Engine: Water (MODIS)').should('be.visible')
    })

    it('should handle 500 error from Enacts endpoint', () => {
        cy.intercept('**/api/*/tokens/google', geeResponse500).as('getGeeToken')
        cy.intercept(
            'GET',
            '**/api/*/routes?fields=id*',
            getRoutesFixture()
        ).as('getRoutes')

        cy.intercept('GET', '**/api/routes/*/run/info', {
            httpStatus: 'Internal Server Error',
            statusCode: 500,
            httpStatusCode: 500,
            status: 'ERROR',
            message: 'Something went wrong while fetching Enacts info',
        }).as('getEnactsInfo')

        cy.visit('#/import')

        cy.wait('@getGeeToken')
        cy.wait('@getRoutes')
        cy.wait('@getEnactsInfo')

        cy.contains('Select dataset to import').should('be.visible')
        cy.getByDataTest('dataset-selector-content')
            .should('be.visible')
            .click()
        cy.contains('Earth Engine: Air temperature (ERA5-Land)').should(
            'not.exist'
        )
        cy.contains('ENACTS: All stations - Rainfall').should('not.exist')
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length', 1)
        cy.contains('No datasets are available.').should('be.visible')

        cy.contains('ENACTS datasets could not be loaded').should('be.visible')
    })

    it('configure import for GEE ERA5-Land weekly dataset', () => {
        cy.visit('#/import')

        selectDataset('Earth Engine: Precipitation (ERA5-Land)')

        // Check the dataset info
        cy.contains(
            'Total precipitation in mm. Data resolution is approximately 9 km (0.1°).'
        ).should('be.visible')
        cy.contains(
            'Data is from ERA5-Land / Copernicus Climate Change Service. Provider: Google Earth Engine'
        ).should('be.visible')

        // Check the period section
        cy.getByDataTest('period-type-selector')
            .find('input[type="radio"]')
            .should('have.length', 3)

        cy.getByDataTest('period-type-selector')
            .contains('Weekly')
            .find('input[type="radio"]')
            .should('not.be.checked')

        cy.contains('Start date').should('be.visible')
        cy.getByDataTest('start-date-input').should('be.visible')

        cy.contains('End date').should('be.visible')
        cy.getByDataTest('end-date-input').should('be.visible')

        cy.contains(
            'Daily data between start and end date will be calculated from hourly data.'
        ).should('be.visible')

        // Check the data element section
        cy.getByDataTest('data-element-select').click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length', 2)
        cy.contains(
            'No data elements found for the selected period type.'
        ).should('be.visible')
        cy.getByDataTest('dhis2-uicore-popper').closePopper()

        // Check organisation unit section
        assertOrgUnitSection()

        // Check review and import section
        cy.contains('Review and import').scrollIntoView()
        cy.contains('Review and import').should('be.visible')
        cy.get('button').contains('Start import').scrollIntoView()
        cy.get('button').contains('Start import').should('be.disabled')

        // Change the period type to weekly
        selectPeriodType('Weekly')

        selectTargetDataElement('IDSR Malaria (weekly)')

        cy.getByDataTest('import-preview').scrollIntoView()
        cy.getByDataTest('import-preview')
            .contains('Precipitation (ERA5-Land)" source data will be imported')
            .should('be.visible')

        cy.getByDataTest('import-preview')
            .contains('Weekly values between')
            .should('be.visible')
        cy.getByDataTest('import-preview')
            .contains('For 13 organisation units')
            .should('be.visible')
        cy.getByDataTest('import-preview')
            .contains('To data element "IDSR Malaria"')
            .should('be.visible')

        cy.getByDataTest('import-preview')
            .contains('data values will be imported')
            .should('be.visible')
    })

    it('allows user to select time zone if not in Etc/UTC', () => {
        cy.intercept('GET', '**/api/system/info', (req) => {
            req.continue((res) => {
                res.body.serverTimeZoneId = 'Africa/Freetown'
            })
        }).as('getSystemInfo')

        cy.visit('#/import')

        cy.wait('@getSystemInfo')

        cy.getByDataTest('dataset-selector-content').click()

        cy.intercept('GET', '**/api/*/system/info?fields=serverTimeZoneId', {
            serverTimeZoneId: 'Africa/Freetown',
        }).as('getSystemInfoSpecific')

        cy.contains('Earth Engine: Precipitation (ERA5-Land)').should(
            'be.visible'
        )
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length.greaterThan', 1)
            .contains('Earth Engine: Precipitation (ERA5-Land)')
            .click()
        cy.wait('@getSystemInfoSpecific')

        cy.contains('Time zone').should('be.visible')
        cy.getByDataTest('time-zone-select').should('be.visible')
        cy.getByDataTest('time-zone-select').contains('Etc/UTC')

        // Change time zone to UTC
        cy.getByDataTest('time-zone-select').click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .contains('Africa/Freetown')
            .click()

        cy.getByDataTest('time-zone-select').contains('Africa/Freetown')

        // Change the period type to weekly
        cy.getByDataTest('period-type-selector').containsExact('Weekly').click()
        cy.getByDataTest('period-type-selector')
            .containsExact('Weekly')
            .find('input[type="radio"]')
            .should('be.checked')

        // Select a weekly data element
        cy.getByDataTest('data-element-select').click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length.greaterThan', 1)
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .contains('IDSR Malaria (weekly)')
            .click()

        // Check import preview section
        cy.getByDataTest('import-preview').scrollIntoView()
        cy.getByDataTest('import-preview')
            .contains(
                '"Precipitation (ERA5-Land)" source data will be imported'
            )
            .should('be.visible')

        cy.getByDataTest('import-preview')
            .contains('Weekly values between')
            .should('be.visible')
        cy.getByDataTest('import-preview')
            .contains('For 13 organisation units')
            .should('be.visible')
        cy.getByDataTest('import-preview')
            .contains('To data element "IDSR Malaria"')
            .should('be.visible')

        cy.getByDataTest('import-preview')
            .contains('data values will be imported')
            .should('be.visible')
    })

    it('select the correct org unit groups and import the correct values', () => {
        cy.visit('#/import')

        selectDataset('Earth Engine: Precipitation (ERA5-Land)')
        selectPeriodType('Weekly')
        typeStartAndEndDates('2025-08-18', '2025-08-24')
        selectTargetDataElement('IDSR Malaria (weekly)')
        selectOrgUnitGroup('Mission')

        // confirm the import details
        cy.getByDataTest('import-preview').scrollIntoView()
        cy.getByDataTest('import-preview')
            .contains('Precipitation (ERA5-Land)" source data will be imported')
            .should('be.visible')

        cy.getByDataTest('import-preview')
            .contains('For 15 organisation units')
            .should('be.visible')

        selectOrgUnitGroup('Rural')

        cy.getByDataTest('import-preview').scrollIntoView()
        cy.getByDataTest('import-preview')
            .contains('For 257 organisation units')
            .should('be.visible')

        // Remove Rural selection
        cy.getByDataTest('dhis2-uicore-chip')
            .contains('Rural')
            .parent()
            .within(() => {
                cy.getByDataTest('dhis2-uicore-chip-remove').click()
            })

        // Remove the Distrct selection for level
        cy.getByDataTest('dhis2-uicore-chip')
            .contains('District')
            .parent()
            .within(() => {
                cy.getByDataTest('dhis2-uicore-chip-remove').click()
            })

        cy.getByDataTest('import-preview').scrollIntoView()
        cy.getByDataTest('import-preview')
            .contains('For 2 organisation units')
            .should('be.visible')

        cy.intercept('POST', '**/api/*/dataValueSets*', {
            statusCode: 200,
            body: { status: 'SUCCESS', importCount: { imported: 2 } },
        }).as('postDataValueSets')
        cy.contains('Start import').click()

        // Wait for and verify the intercepted request
        cy.wait('@postDataValueSets').then((interception) => {
            expect(interception.request.body).to.deep.equal({
                dataValues: [
                    {
                        value: '97.117',
                        orgUnit: 'Z9ny6QeqsgX',
                        dataElement: 'vq2qO3eTrNi',
                        period: '2025W34',
                    },
                    {
                        value: '94.236',
                        orgUnit: 'jCnyQOKQBFX',
                        dataElement: 'vq2qO3eTrNi',
                        period: '2025W34',
                    },
                ],
            })
        })
    })
})
