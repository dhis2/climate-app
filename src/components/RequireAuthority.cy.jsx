import { DataProvider } from '@dhis2/app-runtime'
import React from 'react'
import RequireAuthority from './RequireAuthority.jsx'

const mockConfig = {
    baseUrl: 'http://localhost:8080',
    apiVersion: '40',
}

const mockSystemInfo = { serverTimeZoneId: 'UTC' }

const mockUser = (authorities) => ({
    id: 'uid1',
    username: 'testuser',
    name: 'Test User',
    authorities,
    settings: { keyAnalysisDisplayProperty: 'name' },
})

const mountWithAuthority = (authorities) => {
    cy.intercept('GET', /\/api\/\d+\/me/, {
        body: mockUser(authorities),
    }).as('getMe')
    cy.intercept('GET', /\/api\/\d+\/system\/info/, {
        body: mockSystemInfo,
    }).as('getSystemInfo')

    cy.mount(
        <DataProvider
            baseUrl={mockConfig.baseUrl}
            apiVersion={mockConfig.apiVersion}
        >
            <RequireAuthority>
                <div data-test="protected-content">Protected content</div>
            </RequireAuthority>
        </DataProvider>
    )
}

describe('RequireAuthority', () => {
    it('renders children for a user with F_DATAVALUE_ADD authority', () => {
        mountWithAuthority(['F_DATAVALUE_ADD'])
        cy.getByDataTest('protected-content').should('be.visible')
        cy.contains('Access denied').should('not.exist')
    })

    it('renders children for a superuser with ALL authority', () => {
        mountWithAuthority(['ALL'])
        cy.getByDataTest('protected-content').should('be.visible')
        cy.contains('Access denied').should('not.exist')
    })

    it('shows access denied for a user without F_DATAVALUE_ADD', () => {
        mountWithAuthority([])
        cy.contains('Page not accessible').should('be.visible')
        cy.contains('do not have access').should('be.visible')
        cy.getByDataTest('protected-content').should('not.exist')
    })

    it('shows access denied for a user with unrelated authorities', () => {
        mountWithAuthority(['F_USER_ADD', 'F_REPORT_VIEW'])
        cy.contains('Page not accessible').should('be.visible')
        cy.getByDataTest('protected-content').should('not.exist')
    })
})
