// Intercepts the /me endpoint to simulate a user without F_DATAVALUE_ADD.
// Uses the same credentials configured for the other e2e tests — no extra user needed.

const interceptRestrictedUser = () => {
    cy.intercept('GET', /\/api\/\d+\/me\b/, (req) => {
        req.reply((res) => {
            res.body.authorities = []
        })
    }).as('getMe')
}

describe('Access control for restricted pages', () => {
    const restrictedPaths = ['#/import', '#/setup', '#/settings']

    beforeEach(function () {
        if (!Cypress.env('dhis2BaseUrl')) {
            this.skip()
        }

        interceptRestrictedUser()
        cy.visit('/')
        cy.wait('@getMe')
    })

    it('hides Import, Setup guide, and Settings in the sidebar', () => {
        cy.getByDataTest('imports-menu-item').should('not.exist')
        cy.getByDataTest('setup-guide-menu-item').should('not.exist')
        cy.getByDataTest('settings-menu-item').should('not.exist')
    })

    it('shows Home and Explore data in the sidebar', () => {
        cy.getByDataTest('home-menu-item').should('be.visible')
        cy.getByDataTest('explore-data-menu-item').should('be.visible')
    })

    restrictedPaths.forEach((hash) => {
        it(`shows page not accessible when navigating directly to ${hash}`, () => {
            cy.visit(`/${hash}`)
            cy.wait('@getMe')
            cy.contains('Page not accessible').should('be.visible')
        })
    })

    it('Home page is accessible', () => {
        cy.getByDataTest('home-menu-item').click()
        cy.contains('About this app').should('be.visible')
    })

    it('Explore page is accessible', () => {
        cy.getByDataTest('explore-data-menu-item').click()
        cy.contains('Explore weather and climate data').should('be.visible')
    })
})

describe('Access control - start page redirect', () => {
    beforeEach(function () {
        if (!Cypress.env('dhis2BaseUrl')) {
            this.skip()
        }
        interceptRestrictedUser()
    })

    it('always redirects to Explore regardless of saved start page', () => {
        cy.intercept(
            'GET',
            /\/api\/\d+\/dataStore\/CLIMATE_DATA\/settings/,
            (req) => {
                req.reply((res) => {
                    res.body = { startPage: '/import' }
                })
            }
        ).as('getSettings')
        cy.visit('/')
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/explore')
        })
        cy.contains('Explore weather and climate data').should('be.visible')
    })

    it('redirects to Explore even with no saved start page', () => {
        cy.visit('/')
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/explore')
        })
        cy.contains('Explore weather and climate data').should('be.visible')
    })
})
