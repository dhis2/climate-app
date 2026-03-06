const nonBoundaryStartDate = '2026-01-14' // Wednesday
const nonBoundaryEndDate = '2026-01-29' // Thursday

const assertOrgUnitSection = () => {
    cy.contains('Select organisation units').scrollIntoView()
    cy.contains('Select organisation units').should('be.visible')
    cy.getByDataTest('org-unit-tree').should('be.visible')
}

const selectDataset = (datasetName) => {
    cy.getByDataTest('dataset-selector-content').click()
    cy.contains(datasetName).should('be.visible')
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .should('have.length.greaterThan', 1)
        .contains(datasetName)
        .click()
}

const selectPeriodType = (periodType) => {
    cy.getByDataTest('period-type-selector').containsExact(periodType).click()
    cy.getByDataTest('period-type-selector')
        .containsExact(periodType)
        .find('input[type="radio"]')
        .should('be.checked')
}

const selectOrgUnitGroup = (groupName) => {
    cy.getByDataTest('org-unit-group-select').click()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .should('have.length.greaterThan', 1)
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .contains(groupName)
        .click()
    cy.getByDataTest('dhis2-uicore-popper').closePopper()
}

const selectTargetDataElement = (dataElementName) => {
    // Check that data elements are now available
    cy.getByDataTest('data-element-select').click()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .should('have.length.greaterThan', 1)
    cy.contains('No data elements found for the selected period type.').should(
        'not.exist'
    )

    // Select the data element
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .contains(dataElementName)
        .scrollIntoView()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .children()
        .contains(dataElementName)
        .click()
}

const typeStartAndEndDates = (startDate, endDate) => {
    // Type the start date directly into the input, ignoring the calendar popup
    cy.getByDataTest('start-date-input-content').find('input').clear()
    cy.getByDataTest('start-date-input-content').find('input').type(startDate)

    // Type the end date directly into the input, ignoring the calendar popup
    cy.getByDataTest('end-date-input-content').find('input').clear()
    cy.getByDataTest('end-date-input-content').find('input').type(endDate)
}

const verifyImportPreview = ({
    datasetName,
    period,
    locationInfo,
    dataElementName,
    dataValues,
}) => {
    cy.getByDataTest('import-preview').scrollIntoView()
    cy.getByDataTest('import-preview')
        .contains(`${datasetName}" source data will be imported`)
        .should('be.visible')

    cy.getByDataTest('import-preview')
        .find('li')
        .first()
        .invoke('text')
        .should('eq', period)

    cy.getByDataTest('import-preview')
        .contains(locationInfo)
        .should('be.visible')

    cy.getByDataTest('import-preview')
        .contains(`To data element "${dataElementName}"`)
        .should('be.visible')

    cy.getByDataTest('import-preview')
        .contains(`${dataValues} data values will be imported`)
        .should('be.visible')
}

const makeImportSelections = ({ dataset, dataElement, startDate, endDate }) => {
    cy.visit('#/import')
    selectDataset(dataset)
    selectPeriodType('Weekly')
    typeStartAndEndDates(startDate, endDate)
    selectTargetDataElement(dataElement)
}

const interceptAndValidateDataValues = (expectedCount, valueChecks = []) => {
    cy.intercept('POST', '**/api/*/dataValueSets*', (req) => {
        expect(req.body.dataValues).to.have.lengthOf(expectedCount)

        valueChecks.forEach(({ orgUnit, expectedValue }) => {
            const dataValue = req.body.dataValues.find(
                (dv) => dv.orgUnit === orgUnit
            )
            expect(dataValue).to.exist
            expect(dataValue.value).to.equal(expectedValue)
        })

        req.reply({
            statusCode: 200,
            body: {
                status: 'SUCCESS',
                importCount: { imported: req.body.dataValues.length },
            },
        })
    }).as('postDataValueSets')
}

const removeOrgUnitLevel = (levelName) => {
    cy.getByDataTest('org-unit-level-select').should('be.visible')
    cy.getByDataTest('dhis2-uicore-chip')
        .contains(levelName)
        .parent()
        .within(() => {
            cy.getByDataTest('dhis2-uicore-chip-remove').click()
        })
}

const expandOrgUnitTreeNode = (nodeName) => {
    cy.getByDataTest('org-unit-tree-node')
        .contains(nodeName)
        .closest('[data-test="org-unit-tree-node"]')
        .find('[data-test="org-unit-tree-node-toggle"]')
        .click()
}

const selectOrgUnitFromTree = (unitName) => {
    cy.getByDataTest('org-unit-tree-node').contains(unitName).click()
}

describe('Import', () => {
    it('configure import for GEE ERA5-Land weekly dataset', () => {
        cy.visit('#/import')

        selectDataset('Earth Engine: Precipitation (ERA5-Land)')

        // Check the dataset info
        cy.contains(
            'Total precipitation in mm. Data resolution is approximately 9 km (0.1°).'
        ).should('be.visible')
        cy.contains(
            'Data is from ERA5-Land / Copernicus Climate Change Service. Provider: Google Earth Engine'
        ).should('be.visible')

        // Check the period section
        cy.getByDataTest('period-type-selector')
            .find('input[type="radio"]')
            .should('have.length', 3)

        cy.getByDataTest('period-type-selector')
            .contains('Weekly')
            .find('input[type="radio"]')
            .should('not.be.checked')

        cy.contains('Start date').should('be.visible')
        cy.getByDataTest('start-date-input').should('be.visible')

        cy.contains('End date').should('be.visible')
        cy.getByDataTest('end-date-input').should('be.visible')

        cy.contains(
            'Daily data between start and end date will be aggregated from hourly data.'
        ).should('be.visible')

        // Check the data element section
        cy.getByDataTest('data-element-select').click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length', 2)
        cy.contains(
            'No data elements found for the selected period type.'
        ).should('be.visible')
        cy.getByDataTest('dhis2-uicore-popper').closePopper()

        // Check organisation unit section
        assertOrgUnitSection()

        // Check review and import section
        cy.contains('Review and import').scrollIntoView()
        cy.contains('Review and import').should('be.visible')
        cy.get('button').contains('Start import').scrollIntoView()
        cy.get('button').contains('Start import').should('be.disabled')

        // Change the period type to weekly
        selectPeriodType('Weekly')

        selectTargetDataElement('IDSR Malaria (weekly)')

        cy.getByDataTest('start-date-input').clear()
        cy.getByDataTest('start-date-input').type(nonBoundaryStartDate)
        cy.getByDataTest('end-date-input').clear()
        cy.getByDataTest('end-date-input').type(nonBoundaryEndDate)

        // Check that data elements are now available
        cy.getByDataTest('data-element-select').click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length.greaterThan', 1)
        cy.contains(
            'No data elements found for the selected period type.'
        ).should('not.exist')

        // Select a weekly data element

        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .contains('IDSR Malaria (weekly)')
            .click()

        verifyImportPreview({
            datasetName: 'Precipitation (ERA5-Land)',
            period: 'Weekly values from 2026-W03 to 2026-W05 (2026-01-12 to 2026-02-01)',
            locationInfo:
                'Selected org units: District levels in Sierra Leone (13 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 13,
        })

        cy.getByDataTest('start-date-input').scrollIntoView()
        cy.getByDataTest('start-date-input')
            .find('input')
            .should('have.value', nonBoundaryStartDate)
        cy.getByDataTest('end-date-input')
            .find('input')
            .should('have.value', nonBoundaryEndDate)
    })

    it('allows user to select time zone if not in Etc/UTC', () => {
        cy.intercept('GET', '**/api/system/info', (req) => {
            req.continue((res) => {
                res.body.serverTimeZoneId = 'Africa/Freetown'
            })
        }).as('getSystemInfo')

        cy.visit('#/import')

        cy.wait('@getSystemInfo')

        cy.getByDataTest('dataset-selector-content').click()

        cy.intercept('GET', '**/api/*/system/info?fields=serverTimeZoneId', {
            serverTimeZoneId: 'Africa/Freetown',
        }).as('getSystemInfoSpecific')

        cy.contains('Earth Engine: Precipitation (ERA5-Land)').should(
            'be.visible'
        )
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length.greaterThan', 1)
            .contains('Earth Engine: Precipitation (ERA5-Land)')
            .click()
        cy.wait('@getSystemInfoSpecific')

        cy.contains('Time zone').should('be.visible')
        cy.getByDataTest('time-zone-select').should('be.visible')
        cy.getByDataTest('time-zone-select').contains('Etc/UTC')

        // Change time zone to UTC
        cy.getByDataTest('time-zone-select').click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .contains('Africa/Freetown')
            .click()

        cy.getByDataTest('time-zone-select').contains('Africa/Freetown')

        // Change the period type to weekly
        cy.getByDataTest('period-type-selector').containsExact('Weekly').click()
        cy.getByDataTest('period-type-selector')
            .containsExact('Weekly')
            .find('input[type="radio"]')
            .should('be.checked')

        cy.getByDataTest('start-date-input').clear()
        cy.getByDataTest('start-date-input').type(nonBoundaryStartDate)
        cy.getByDataTest('end-date-input').clear()
        cy.getByDataTest('end-date-input').type(nonBoundaryEndDate)

        // Select a weekly data element
        cy.getByDataTest('data-element-select').click()
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .should('have.length.greaterThan', 1)
        cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
            .children()
            .contains('IDSR Malaria (weekly)')
            .click()

        // Check import preview section

        verifyImportPreview({
            datasetName: 'Precipitation (ERA5-Land)',
            period: 'Weekly values from 2026-W03 to 2026-W05 (2026-01-12 to 2026-02-01)',
            locationInfo:
                'Selected org units: District levels in Sierra Leone (13 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 13,
        })

        cy.getByDataTest('start-date-input').scrollIntoView()
        cy.getByDataTest('start-date-input')
            .find('input')
            .should('have.value', nonBoundaryStartDate)
        cy.getByDataTest('end-date-input')
            .find('input')
            .should('have.value', nonBoundaryEndDate)
    })

    it('select the correct org unit groups and import the correct values', () => {
        cy.visit('#/import')

        selectDataset('Earth Engine: Precipitation (ERA5-Land)')
        selectPeriodType('Weekly')
        typeStartAndEndDates('2025-08-18', '2025-08-24')
        selectTargetDataElement('IDSR Malaria (weekly)')
        selectOrgUnitGroup('Mission')

        // confirm the import details
        verifyImportPreview({
            datasetName: 'Precipitation (ERA5-Land)',
            period: 'For 2025-W34 (2025-08-18 to 2025-08-24)',
            locationInfo:
                'Selected org units: Mission groups in Sierra Leone - District levels in Sierra Leone (15 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 15,
        })

        selectOrgUnitGroup('Rural')

        verifyImportPreview({
            datasetName: 'Precipitation (ERA5-Land)',
            period: 'For 2025-W34 (2025-08-18 to 2025-08-24)',
            locationInfo:
                'Selected org units: Mission groups in Sierra Leone - District levels in Sierra Leone - Rural groups in Sierra Leone (257 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 257,
        })

        // Remove Rural selection
        cy.getByDataTest('dhis2-uicore-chip')
            .contains('Rural')
            .parent()
            .within(() => {
                cy.getByDataTest('dhis2-uicore-chip-remove').click()
            })

        // Remove the Distrct selection for level
        cy.getByDataTest('dhis2-uicore-chip')
            .contains('District')
            .parent()
            .within(() => {
                cy.getByDataTest('dhis2-uicore-chip-remove').click()
            })

        verifyImportPreview({
            datasetName: 'Precipitation (ERA5-Land)',
            period: 'For 2025-W34 (2025-08-18 to 2025-08-24)',
            locationInfo:
                'Selected org units: Mission groups in Sierra Leone (13 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 13,
        })

        cy.intercept('POST', '**/api/*/dataValueSets*', {
            statusCode: 200,
            body: { status: 'SUCCESS', importCount: { imported: 2 } },
        }).as('postDataValueSets')
        cy.contains('Start import').click()

        // Wait for and verify the intercepted request
        cy.wait('@postDataValueSets', { timeout: 25000 }).then(
            (interception) => {
                expect(interception.request.body).to.deep.equal({
                    dataValues: [
                        {
                            value: '97.117',
                            orgUnit: 'Z9ny6QeqsgX',
                            dataElement: 'vq2qO3eTrNi',
                            period: '2025W34',
                        },
                        {
                            value: '94.236',
                            orgUnit: 'jCnyQOKQBFX',
                            dataElement: 'vq2qO3eTrNi',
                            period: '2025W34',
                        },
                    ],
                })
            }
        )
    })

    it('selects levels only for org units at or above the level in the tree', () => {
        makeImportSelections({
            dataset: 'Earth Engine: Precipitation (ERA5-Land)',
            dataElement: 'IDSR Malaria (weekly)',
            startDate: '2026-01-01',
            endDate: '2026-01-03',
        })

        cy.getByDataTest('org-unit-tree').should('be.visible')
        expandOrgUnitTreeNode('Bonthe')
        selectOrgUnitFromTree('Bendu Cha')

        cy.getByDataTest('org-unit-level-select').should('contain', 'District')

        verifyImportPreview({
            datasetName: 'Precipitation (ERA5-Land)',
            period: 'For 2026-W01 (2025-12-29 to 2026-01-04)',
            locationInfo:
                'Selected org units: District levels in Sierra Leone, Bendu Cha (13 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 13,
        })

        cy.intercept('POST', '**/api/*/dataValueSets*', (req) => {
            expect(req.body.dataValues).to.have.lengthOf(13)
            req.reply({
                statusCode: 200,
                body: { status: 'SUCCESS', importCount: { imported: 13 } },
            })
        }).as('postDataValueSets')
        cy.contains('Start import').click()
        cy.wait('@postDataValueSets', { timeout: 25000 })
    })

    it('selects org unit from tree with org unit group but no level', () => {
        makeImportSelections({
            dataset: 'Earth Engine: Air temperature (ERA5-Land)',
            dataElement: 'IDSR Malaria (weekly)',
            startDate: '2026-01-01',
            endDate: '2026-01-27',
        })

        selectOrgUnitFromTree('Sierra Leone')
        selectOrgUnitFromTree('Bonthe')
        removeOrgUnitLevel('District')
        selectOrgUnitGroup('Rural')

        verifyImportPreview({
            datasetName: 'Air temperature (ERA5-Land)',
            period: 'For 2026-W01 to 2026-W04 (2025-12-29 to 2026-01-26)',
            locationInfo:
                'Selected org units: Rural groups in Bonthe (41 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 41,
        })

        interceptAndValidateDataValues(41, [
            { orgUnit: 'lc3eMKXaEfw', expectedValue: '25.9' },
            { orgUnit: 'EB1zRKdYjdY', expectedValue: '26.2' },
        ])

        cy.contains('Start import').click()
        cy.wait('@postDataValueSets', { timeout: 25000 })
    })

    it('selects with both level and group', () => {
        makeImportSelections({
            dataset: 'Earth Engine: Precipitation (ERA5-Land)',
            dataElement: 'IDSR Malaria (weekly)',
            startDate: '2026-01-01',
            endDate: '2026-01-03',
        })

        cy.getByDataTest('org-unit-tree').should('be.visible')
        cy.getByDataTest('org-unit-level-select').should('contain', 'District')
        selectOrgUnitGroup('Rural')

        verifyImportPreview({
            datasetName: 'Precipitation (ERA5-Land)',
            period: 'For 2026-W01 (2025-12-29 to 2026-01-04)',
            locationInfo:
                'Selected org units: Rural groups in Sierra Leone - District levels in Sierra Leone (257 organisation units have geometry and will be imported)',
            dataElementName: 'IDSR Malaria',
            dataValues: 257,
        })

        cy.intercept('POST', '**/api/*/dataValueSets*', (req) => {
            expect(req.body.dataValues).to.have.lengthOf(257)
            req.reply({
                statusCode: 200,
                body: {
                    status: 'SUCCESS',
                    importCount: { imported: req.body.dataValues.length },
                },
            })
        }).as('postDataValueSets')
        cy.contains('Start import').click()
        cy.wait('@postDataValueSets', { timeout: 25000 })
    })

    describe('Organisation unit warning scenarios', () => {
        it('shows error message when org unit geometries fail to load', () => {
            // Intercept the geoFeatures query to return an error
            cy.intercept('GET', '**/api/*/geoFeatures?**', {
                statusCode: 500,
                body: {
                    httpStatus: 'Internal Server Error',
                    statusCode: 500,
                    status: 'ERROR',
                    message: 'Failed to load organisation unit geometries',
                },
            }).as('getGeoFeaturesError')

            cy.visit('#/import')

            selectDataset('Earth Engine: Precipitation (ERA5-Land)')
            selectPeriodType('Weekly')
            typeStartAndEndDates('2026-01-01', '2026-01-03')
            selectTargetDataElement('IDSR Malaria (weekly)')

            cy.wait('@getGeoFeaturesError')

            // Verify the error message is displayed in the org units section
            cy.getByDataTest('org-units-selector')
                .contains('An unknown error occurred')
                .scrollIntoView()
            cy.getByDataTest('org-units-selector')
                .contains('An unknown error occurred')
                .should('be.visible')

            // Import button should still be disabled due to error
            cy.get('button').contains('Start import').should('be.disabled')
        })

        it('shows warning when no org unit geometries are found', () => {
            cy.visit('#/import')

            selectDataset('Earth Engine: Precipitation (ERA5-Land)')
            selectPeriodType('Weekly')
            typeStartAndEndDates('2026-01-01', '2026-01-03')
            selectTargetDataElement('IDSR Malaria (weekly)')

            // Deselect Sierra Leone
            selectOrgUnitFromTree('Sierra Leone')

            // Remove District level
            removeOrgUnitLevel('District')

            // Verify the warning message is displayed
            cy.getByDataTest('org-units-selector')
                .contains('No org unit geometries found')
                .should('be.visible')

            // Import button should be disabled when no geometries found
            cy.get('button').contains('Start import').should('be.disabled')
        })

        it('shows error when org unit selection is invalid', () => {
            cy.visit('#/import')

            selectDataset('Earth Engine: Precipitation (ERA5-Land)')
            selectPeriodType('Weekly')
            typeStartAndEndDates('2026-01-01', '2026-01-03')
            selectTargetDataElement('IDSR Malaria (weekly)')

            // Check that Start import is enabled with default selection
            cy.get('button').contains('Start import').should('not.be.disabled')

            // Make an invalid org unit selection
            // Unselect Sierra Leone
            selectOrgUnitFromTree('Sierra Leone')

            // Drill down to Bendu Cha and select it
            expandOrgUnitTreeNode('Bonthe')
            selectOrgUnitFromTree('Bendu Cha')

            // Leave the level at "District" - this creates an invalid selection
            cy.getByDataTest('org-unit-level-select').should(
                'contain',
                'District'
            )

            // Verify the error message is displayed
            cy.getByDataTest('org-units-selector')
                .contains(
                    'Organisation unit or organisation unit level is not valid'
                )
                .should('be.visible')

            // Import button should be disabled due to invalid selection
            cy.get('button').contains('Start import').should('be.disabled')

            // unselect Bendu Cha to return to valid selection and verify error message goes away and import button is enabled again
            selectOrgUnitFromTree('Bendu Cha')

            cy.getByDataTest('org-units-selector')
                .contains(
                    'Organisation unit or organisation unit level is not valid'
                )
                .should('not.exist')

            cy.get('button').contains('Start import').should('not.be.disabled')
        })
    })
})
