/// <reference types="cypress" />
import '@dhis2/cypress-commands'

// Custom command to select DOM elements by data-test attribute
Cypress.Commands.add('getByDataTest', (selector, ...args) =>
    cy.get(`[data-test=${selector}]`, ...args)
)

Cypress.Commands.add(
    'containsExact',
    {
        prevSubject: true,
    },
    (subject, selector) =>
        cy.wrap(subject).contains(
            new RegExp(
                `^${selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, //eslint-disable-line no-useless-escape
                'gm'
            )
        )
)

Cypress.Commands.add(
    'closePopper',
    {
        prevSubject: true,
    },
    (subject) =>
        cy
            .wrap(subject)
            .closest('[data-test=dhis2-uicore-layer]')
            .click('topLeft')
)
