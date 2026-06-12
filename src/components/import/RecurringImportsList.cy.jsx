import React from 'react'
import RecurringImportsList from './RecurringImportsList.jsx'

const baseConfig = {
    id: 'cfg-1',
    name: 'Weekly Precipitation',
    dataset: { id: 'ECMWF/ERA5', name: 'Precipitation (ERA5-Land)' },
    datasetId: 'ECMWF/ERA5',
    datasetName: 'Precipitation (ERA5-Land)',
    dataElement: { id: 'deId1', displayName: 'IDSR Malaria' },
    orgUnits: [{ id: 'ou1', name: 'Org Unit 1' }],
    featureCount: 3,
    periodType: 'WEEKLY',
    dataUpdatedThrough: null,
    lastRunAt: null,
    createdAt: '2026-01-01T12:00:00.000Z',
    createdByName: 'Test User',
}

const mount = (config, props = {}) => {
    const onRun = cy.stub().as('onRun')
    const onRename = cy.stub().as('onRename')
    const onDelete = cy.stub().as('onDelete')
    cy.mount(
        <RecurringImportsList
            configs={[config]}
            onRun={onRun}
            onRename={onRename}
            onDelete={onDelete}
            {...props}
        />
    )
    return { onRun, onRename, onDelete }
}

describe('RecurringImportsList', () => {
    describe('display', () => {
        it('shows the config name', () => {
            mount(baseConfig)
            cy.contains('Weekly Precipitation').should('be.visible')
        })

        it('shows period type and org unit count', () => {
            mount(baseConfig)
            cy.contains('Weekly · 3 org units').should('be.visible')
        })

        it('shows singular org unit count', () => {
            mount({ ...baseConfig, featureCount: 1 })
            cy.contains('1 org unit').should('be.visible')
        })

        it('shows "Never imported" when lastRunAt is null', () => {
            mount(baseConfig)
            cy.contains('Never imported').should('be.visible')
        })

        it('shows "Last run" when lastRunAt is set', () => {
            mount({ ...baseConfig, lastRunAt: '2026-05-01T10:00:00.000Z' })
            cy.contains('Last run').should('be.visible')
        })

        it('shows "Data imported through" with formatted date when dataUpdatedThrough is set', () => {
            mount({
                ...baseConfig,
                lastRunAt: '2026-05-01T10:00:00.000Z',
                dataUpdatedThrough: '2026-04-30',
            })
            cy.contains('Data imported through Apr 30, 2026').should(
                'be.visible'
            )
        })

        it('shows a last run error message when lastRunError is set', () => {
            mount({
                ...baseConfig,
                lastRunAt: '2026-05-01T10:00:00.000Z',
                lastRunError: 'Connection timed out',
            })
            cy.contains('Connection timed out').should('be.visible')
        })

        it('does not show an error message when lastRunError is absent', () => {
            mount(baseConfig)
            cy.contains('Connection timed out').should('not.exist')
        })

        it('renders all configs when multiple are provided', () => {
            const onRun = cy.stub().as('onRun')
            const onRename = cy.stub().as('onRename')
            const onDelete = cy.stub().as('onDelete')
            cy.mount(
                <RecurringImportsList
                    configs={[
                        { ...baseConfig, id: 'cfg-1', name: 'Config One' },
                        { ...baseConfig, id: 'cfg-2', name: 'Config Two' },
                    ]}
                    onRun={onRun}
                    onRename={onRename}
                    onDelete={onDelete}
                />
            )
            cy.contains('Config One').should('be.visible')
            cy.contains('Config Two').should('be.visible')
        })
    })

    describe('Import button', () => {
        it('is enabled when a dataset is present', () => {
            mount(baseConfig)
            cy.contains('button', 'Import…').should('not.be.disabled')
        })

        it('is disabled when no dataset is resolved', () => {
            mount({ ...baseConfig, dataset: undefined })
            cy.contains('button', 'Import…').should('be.disabled')
        })

        it('calls onRun with the config when clicked', () => {
            mount(baseConfig)
            cy.contains('button', 'Import…').click()
            cy.get('@onRun').should('have.been.calledOnce')
            cy.get('@onRun').should('have.been.calledWithMatch', {
                id: 'cfg-1',
                name: 'Weekly Precipitation',
            })
        })
    })

    describe('rename', () => {
        it('clicking the rename icon shows an input pre-filled with the name', () => {
            mount(baseConfig)
            cy.get('[aria-label="Rename"]').click()
            cy.get('input[type="text"]').should(
                'have.value',
                'Weekly Precipitation'
            )
        })

        it('pressing Enter commits the rename and calls onRename', () => {
            mount(baseConfig)
            cy.get('[aria-label="Rename"]').click()
            cy.get('input[type="text"]').clear()
            cy.get('input[type="text"]').type('Renamed Config{enter}')
            cy.get('@onRename').should(
                'have.been.calledWith',
                'cfg-1',
                'Renamed Config'
            )
            cy.get('input[type="text"]').should('not.exist')
        })

        it('pressing Escape cancels without calling onRename', () => {
            mount(baseConfig)
            cy.get('[aria-label="Rename"]').click()
            cy.get('input[type="text"]').clear()
            cy.get('input[type="text"]').type('Abandoned Edit{esc}')
            cy.get('@onRename').should('not.have.been.called')
            cy.get('input[type="text"]').should('not.exist')
        })

        it('does not call onRename when the name is unchanged', () => {
            mount(baseConfig)
            cy.get('[aria-label="Rename"]').click()
            cy.get('input[type="text"]').type('{enter}')
            cy.get('@onRename').should('not.have.been.called')
        })

        it('does not call onRename when the trimmed name is empty', () => {
            mount(baseConfig)
            cy.get('[aria-label="Rename"]').click()
            cy.get('input[type="text"]').clear()
            cy.get('input[type="text"]').type('   {enter}')
            cy.get('@onRename').should('not.have.been.called')
        })
    })

    describe('overflow menu', () => {
        it('opens the menu when More actions is clicked', () => {
            mount(baseConfig)
            cy.get('[aria-label="More actions"]').click()
            cy.contains('Rename').should('be.visible')
            cy.contains('Delete').should('be.visible')
        })

        it('clicking Rename in the menu starts editing', () => {
            mount(baseConfig)
            cy.get('[aria-label="More actions"]').click()
            cy.contains('Rename').click()
            cy.get('input[type="text"]').should(
                'have.value',
                'Weekly Precipitation'
            )
        })

        it('clicking Delete in the menu calls onDelete with the config', () => {
            mount(baseConfig)
            cy.get('[aria-label="More actions"]').click()
            cy.contains('Delete').click()
            cy.get('@onDelete').should('have.been.calledOnce')
            cy.get('@onDelete').should('have.been.calledWithMatch', {
                id: 'cfg-1',
            })
        })
    })
})
