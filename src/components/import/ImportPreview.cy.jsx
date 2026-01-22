import React from 'react'
import ImportPreview from './ImportPreview.jsx'

describe('ImportPreview', () => {
    const defaultProps = {
        dataset: 'Test my data element',
        periodType: 'MONTHLY',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        dataElement: 'Temperature',
        totalValues: 120,
        orgUnits: {
            level: '3',
            levelName: 'Chiefdom',
            parent: {
                displayName: 'Test Province',
                level: 2,
                name: 'Test Province',
                path: '/province/test',
            },
        },
        calendar: 'gregory',
    }

    it('renders the dataset name', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains(
            '"Test my data element" source data will be imported:'
        ).should('be.visible')
    })

    it('renders period information for date range', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains('between 2025-01-01 and 2025-12-31').should('be.visible')
    })

    it('renders organization unit information when parent level differs from selected level', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains(
            'For all organisation units at chiefdom level within Test Province'
        ).should('be.visible')
    })

    it('renders organization unit information when parent level equals selected level', () => {
        const props = {
            ...defaultProps,
            orgUnits: {
                level: '2',
                levelName: 'Province',
                parent: {
                    displayName: 'Test Province',
                    level: 2,
                    name: 'Test Province',
                    path: '/province/test',
                },
            },
        }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('For Test Province province').should('be.visible')
    })

    it('renders data element information', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains('To data element "Temperature"').should('be.visible')
    })

    it.skip('renders total values count', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains('120 data values will be imported').should('be.visible')
    })

    it('renders singular form when totalValues is 1', () => {
        const props = { ...defaultProps, totalValues: 1 }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('1 data value will be imported').should('be.visible')
    })

    it('shows single period information when start and end dates are the same', () => {
        const props = {
            ...defaultProps,
            startDate: '2025-01-15',
            endDate: '2025-01-15',
        }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('For every month between 2025-01-15 and 2025-01-15').should(
            'be.visible'
        )
    })

    it('shows "includes partial" text when dates land mid-month', () => {
        const props = {
            ...defaultProps,
            periodType: 'MONTHLY',
            startDate: '2025-01-15',
            endDate: '2025-03-20',
        }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('includes partial').should('be.visible')
    })

    it('does not show "includes partial" text for complete months', () => {
        const props = {
            ...defaultProps,
            periodType: 'MONTHLY',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
        }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('includes partial').should('not.exist')
    })

    it('shows "includes partial" text when dates land mid-week', () => {
        const props = {
            ...defaultProps,
            periodType: 'WEEKLY',
            startDate: '2025-01-15',
            endDate: '2025-02-18',
        }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('includes partial').should('be.visible')
    })

    it('works with different calendar systems', () => {
        const props = {
            ...defaultProps,
            calendar: 'ethiopian',
        }
        cy.mount(<ImportPreview {...props} />)
        cy.get('[data-test="import-preview"]').should('be.visible')
    })

    it('renders all list items', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.get('li').should('have.length', 4)
    })
})
