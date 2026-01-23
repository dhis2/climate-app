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

    it('shows 4 main pieces of information', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.getByDataTest('import-preview').within(() => {
            cy.get('div').should('have.length', 1)
            cy.get('li').should('have.length', 4)
        })
    })

    it('renders the dataset name', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains(
            '"Test my data element" source data will be imported:'
        ).should('be.visible')
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

    it('renders total values count', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains('120 data value').should('be.visible')
    })

    it('renders singular form when totalValues is 1', () => {
        const props = { ...defaultProps, totalValues: 1 }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('1 data value will be imported').should('be.visible')
    })

    describe('MONTHLY period type', () => {
        it('renders period information for monthly data', () => {
            const props = {
                ...defaultProps,
                periodType: 'MONTHLY',
                startDate: '2025-01-01',
                endDate: '2025-12-31',
            }
            cy.mount(<ImportPreview {...props} />)
            cy.contains(
                'Monthly values between 2025-01-01 and 2025-12-31'
            ).should('be.visible')
        })
    })

    describe('DAILY period type', () => {
        it('renders period information for daily data', () => {
            const props = {
                ...defaultProps,
                periodType: 'DAILY',
                startDate: '2025-01-01',
                endDate: '2025-01-31',
            }
            cy.mount(<ImportPreview {...props} />)
            cy.contains(
                'Daily values between 2025-01-01 and 2025-01-31'
            ).should('be.visible')
        })

        it('renders single day information when start and end are the same', () => {
            const props = {
                ...defaultProps,
                periodType: 'DAILY',
                startDate: '2025-01-15',
                endDate: '2025-01-15',
            }
            cy.mount(<ImportPreview {...props} />)
            cy.contains('For the day 2025-01-15').should('be.visible')
        })
    })

    describe('WEEKLY period type', () => {
        it('renders period information for weekly data', () => {
            const props = {
                ...defaultProps,
                periodType: 'WEEKLY',
                startDate: '2025-01-06',
                endDate: '2025-01-26',
            }
            cy.mount(<ImportPreview {...props} />)
            cy.contains(
                'Weekly values between 2025-01-06 and 2025-01-26'
            ).should('be.visible')
        })
    })

    describe('YEARLY period type', () => {
        it('renders period information for yearly data', () => {
            const props = {
                ...defaultProps,
                periodType: 'YEARLY',
                startDate: '2020',
                endDate: '2025',
            }
            cy.mount(<ImportPreview {...props} />)
            cy.contains('Yearly values between 2020 and 2025').should(
                'be.visible'
            )
        })

        it('renders single year information when start and end are the same', () => {
            const props = {
                ...defaultProps,
                periodType: 'YEARLY',
                startDate: '2025',
                endDate: '2025',
            }
            cy.mount(<ImportPreview {...props} />)
            cy.contains('For the year 2025').should('be.visible')
        })
    })
})
