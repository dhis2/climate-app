describe('Smoke test', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should load and display the About page', () => {
        cy.contains('About this app').should('be.visible')
        cy.contains('DHIS2 for Climate').should('be.visible')
        cy.get('body').should('not.be.empty')
    })

    it('should display sidebar menu items', () => {
        cy.getByDataTest('home-menu-item').should('contain', 'Home')
        cy.getByDataTest('explore-data-menu-item').should(
            'contain',
            'Explore data'
        )
        cy.getByDataTest('import-data-menu-item').should(
            'contain',
            'Import data'
        )
        cy.getByDataTest('setup-guide-menu-item').should(
            'contain',
            'Setup guide'
        )
        cy.getByDataTest('settings-menu-item').should('contain', 'Settings')
    })

    it('should navigate to all the pages from the sidebar menu', () => {
        // navigate to Setup page
        cy.getByDataTest('setup-guide-menu-item').click()

        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/setup')
        })
        cy.get('h1')
            .contains('Configure DHIS2 in order to import data')
            .scrollIntoView()
        cy.get('h1')
            .contains('Configure DHIS2 in order to import data')
            .should('be.visible')
        cy.getByDataTest('dataset-selector').should('be.visible')

        // navigate to Explore page
        cy.getByDataTest('explore-data-menu-item').click()
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/explore')
        })
        cy.get('h1')
            .contains('Explore weather and climate data')
            .scrollIntoView()
        cy.get('h1')
            .contains('Explore weather and climate data')
            .should('be.visible')
        cy.getByDataTest('dataset-selector').should('not.exist')

        // navigate to Import data page
        cy.getByDataTest('import-data-menu-item').click()
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/import')
        })
        cy.get('h1')
            .contains('Import weather and climate data')
            .scrollIntoView()
        cy.get('h1')
            .contains('Import weather and climate data')
            .should('be.visible')
        cy.getByDataTest('dataset-selector').should('be.visible')

        // navigate to Settings page
        cy.getByDataTest('settings-menu-item').click()
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/settings')
        })
        cy.get('h1').contains('App settings').scrollIntoView()
        cy.get('h1').contains('App settings').should('be.visible')

        // navigate to Home page
        cy.getByDataTest('home-menu-item').click()
        cy.location().should((loc) => {
            expect(loc.hash).to.eq('#/home')
        })
        cy.get('h1').contains('About this app').scrollIntoView()
        cy.get('h1').contains('About this app').should('be.visible')
    })
})
