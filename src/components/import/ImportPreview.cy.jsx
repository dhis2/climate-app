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
        featureCount: 5,
        orgUnits: [
            {
                id: 'KKkLOTpMXGV',
                path: '/ImspTQPwCqd/fdc6uOvgoji/KKkLOTpMXGV',
                name: 'Bombali & Sebora',
            },
            {
                id: 'LEVEL-m9lBJogzE95',
                name: 'Facility',
            },
            {
                id: 'OU_GROUP-tDZVQ1WtwpA',
                name: 'Hospital',
            },
            {
                id: 'OU_GROUP-RXL3lPSK8oG',
                name: 'Clinic',
            },
        ],
    }

    it('shows 4 main pieces of information', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.getByDataTest('import-preview').within(() => {
            cy.get('div').should('have.length', 2)
            cy.get('li').should('have.length', 4)
        })
    })

    it('renders the dataset name', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains(
            '"Test my data element" source data will be imported:'
        ).should('be.visible')
    })

    it('renders organization unit information with plural form', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains('5 organisation units').should('be.visible')
    })

    it('renders organization unit information with singular form', () => {
        const props = {
            ...defaultProps,
            featureCount: 1,
        }
        cy.mount(<ImportPreview {...props} />)
        cy.contains('1 organisation unit').should('be.visible')
        cy.getByDataTest('import-preview').should('not.contain', 'units')
    })

    it('renders orgUnits text without HTML encoding special characters', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        // Verify that "&" in "Bombali & Sebora" is not HTML encoded as "&amp;"
        cy.getByDataTest('import-preview').should('contain', 'Bombali & Sebora')
    })

    it('renders mixed orgUnits (levels, groups, and regular units)', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.getByDataTest('import-preview').should('contain', 'Hospital')
        cy.getByDataTest('import-preview').should('contain', 'Clinic')
        cy.getByDataTest('import-preview').should('contain', 'Facility')
    })

    it('renders the complete organization unit text string', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains(
            'For Hospital and Clinic groups in Bombali & Sebora - Facility levels in Bombali & Sebora (5 organisation units)'
        ).should('be.visible')
    })

    it('renders data element information', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains('To data element "Temperature"').should('be.visible')
    })

    it('renders total values count', () => {
        cy.mount(<ImportPreview {...defaultProps} />)
        cy.contains('120 data values will be imported').should('be.visible')
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
