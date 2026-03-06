// ***********************************************************
// This example support/component.js is processed and
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
import i18n from '@dhis2/d2-i18n'
import { mount } from 'cypress/react'
import enTranslations from '../../src/locales/en/translations.json'
import '../../src/locales/index.js'

// Move translations from 'default' namespace to 'translation' namespace
// The locales file auto-generates with 'default' namespace, but d2-i18n expects 'translation'
i18n.addResources('en', 'translation', enTranslations)

Cypress.Commands.add('mount', mount)
