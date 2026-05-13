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

describe('Datasets', () => {
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

    it('should open Explore and show temperature graph for an org unit', () => {
        cy.visit('#/explore')

        cy.contains('Explore weather and climate data').should('be.visible')

        cy.get('[data-test="dhis2-uiwidgets-orgunittree-node-label"]').eq(0).click()

        cy.contains('No geometry found').should('be.visible')

        cy.get('[data-test="dhis2-uiwidgets-orgunittree-node-label"]').eq(1).click()

        cy.get('h1').should('be.visible')
        cy.contains('Temperature').should('be.visible')
        cy.contains('Precipitation').should('be.visible')
        cy.contains('Mean temperature').should('be.visible')
        cy.contains('Temperature range').should('be.visible')

        cy.get('.highcharts-series').should('be.visible')
        cy.contains('Open as Map').should('exist')
    })


})
