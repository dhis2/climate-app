// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands.js'

const SESSION_COOKIE_NAME = 'JSESSIONID'
const LOCAL_STORAGE_KEY = 'DHIS2_BASE_URL'

before(() => {
    const username = Cypress.env('dhis2Username')
    const password = Cypress.env('dhis2Password')
    const baseUrl = Cypress.env('dhis2BaseUrl')

    if (!baseUrl || !username || !password) {
        // Skip DHIS2 login if credentials not configured
        return
    }

    cy.loginByApi({ username, password, baseUrl })
        .its('status')
        .should('equal', 200)

    cy.getAllCookies().then((cookies) => {
        const sessionCookie = cookies.find(
            (cookie) =>
                cookie.name === SESSION_COOKIE_NAME &&
                baseUrl.includes(cookie.path)
        )
        if (sessionCookie) {
            Cypress.env('sessionCookie', JSON.stringify(sessionCookie))
        }
    })
})

beforeEach(() => {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const sessionCookie = Cypress.env('sessionCookie')

    if (!baseUrl || !sessionCookie) {
        // Skip if not configured
        return
    }

    const { name, value, ...options } = JSON.parse(sessionCookie)

    localStorage.setItem(LOCAL_STORAGE_KEY, baseUrl)
    cy.setCookie(name, value, options)
})
