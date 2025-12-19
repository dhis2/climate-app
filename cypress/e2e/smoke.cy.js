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

    // This test is currently skipped because the navigation is using MenuItem href
    // which cypress seems to interpret as leaving the page
    it.skip('should navigate to Settings page when clicked', () => {
        cy.getByDataTest('settings-menu-item').click()
        // cy.location('hash').should('eq', '#/setup')
        cy.get('h1').contains('App settings').should('be.visible')
    })
})
