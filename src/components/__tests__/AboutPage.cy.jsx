import { DataProvider } from '@dhis2/app-runtime'
import React from 'react'
import AboutPage from '../AboutPage.jsx'

// Mock data provider config for testing
const mockConfig = {
    baseUrl: 'http://localhost:8080',
    apiVersion: '40',
}

const AboutPageWithProvider = () => (
    <DataProvider
        baseUrl={mockConfig.baseUrl}
        apiVersion={mockConfig.apiVersion}
    >
        <AboutPage />
    </DataProvider>
)

describe('AboutPage Component', () => {
    it('should render successfully', () => {
        cy.mount(<AboutPageWithProvider />)
        // Check that the component renders without errors
        cy.get('div').should('exist')
    })

    it('should display the main heading', () => {
        cy.mount(<AboutPageWithProvider />)
        cy.contains('About this app').should('be.visible')
    })

    it('should display project description', () => {
        cy.mount(<AboutPageWithProvider />)
        cy.contains('DHIS2 for Climate').should('be.visible')
    })

    it('should display app functionality description', () => {
        cy.mount(<AboutPageWithProvider />)
        cy.contains(
            'temperature, precipitation, humidity and heat stress data'
        ).should('be.visible')
    })

    it('should contain YouTube video iframe', () => {
        cy.mount(<AboutPageWithProvider />)
        cy.get('iframe[src*="youtube-nocookie.com"]').should('exist')
        cy.get('iframe[title="YouTube video player"]').should('exist')
    })

    it('should contain link to Copernicus climate data', () => {
        cy.mount(<AboutPageWithProvider />)
        cy.get('a[href*="cds.climate.copernicus.eu"]').should('exist')
    })

    it('should have proper container structure', () => {
        cy.mount(<AboutPageWithProvider />)
        // Check that the main container exists (it may have a CSS module class name)
        cy.get('div').should('exist')
        cy.get('h1').should('contain.text', 'About this app')
    })
})
