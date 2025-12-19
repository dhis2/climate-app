/// <reference types="cypress" />
import '@dhis2/cypress-commands'

// Custom command to select DOM elements by data-test attribute
Cypress.Commands.add('getByDataTest', (selector, ...args) =>
    cy.get(`[data-test=${selector}]`, ...args)
)
