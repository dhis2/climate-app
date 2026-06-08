import PropTypes from 'prop-types'
import React from 'react'
import ImportModal from './ImportModal.jsx'

const defaultProps = {
    dataset: { id: 'dsId1', name: 'ERA5-Land Temperature' },
    period: { periodType: 'MONTHLY', startDate: '2025-01', endDate: '2025-12' },
    features: [{ id: 'ouId1' }],
    dataElement: { id: 'deId1', displayName: 'Temperature' },
    onClose: () => {},
}

const friendlyErrorMessage =
    'An org unit in your selection has boundaries that are too detailed to process. Try removing org units with very complex boundaries and importing again.'

// Stays in the loading state indefinitely
const LoadingExtract = () => null

// Immediately signals successful completion
const SuccessExtract = ({ onComplete }) => {
    React.useEffect(() => onComplete(), [onComplete])
    return null
}
SuccessExtract.propTypes = { onComplete: PropTypes.func.isRequired }

// Mirrors ExtractGeeData error behaviour: renders the friendly message and calls onComplete
const ErrorExtract = ({ onComplete }) => {
    React.useEffect(() => onComplete(), [onComplete])
    return <div>{friendlyErrorMessage}</div>
}
ErrorExtract.propTypes = { onComplete: PropTypes.func.isRequired }

describe('ImportModal', () => {
    it('shows the modal title', () => {
        cy.mount(
            <ImportModal
                {...defaultProps}
                ExtractDataComponent={LoadingExtract}
            />
        )
        cy.contains('Importing climate data').should('be.visible')
    })

    it('shows a disabled "Importing..." button while in progress', () => {
        cy.mount(
            <ImportModal
                {...defaultProps}
                ExtractDataComponent={LoadingExtract}
            />
        )
        cy.contains('button', 'Importing...').should('be.disabled')
    })

    it('enables the Close button after import completes', () => {
        cy.mount(
            <ImportModal
                {...defaultProps}
                ExtractDataComponent={SuccessExtract}
            />
        )
        cy.contains('button', 'Close').should('not.be.disabled')
    })

    it('calls onClose when Close is clicked after import', () => {
        const onClose = cy.stub()
        cy.mount(
            <ImportModal
                {...defaultProps}
                onClose={onClose}
                ExtractDataComponent={SuccessExtract}
            />
        )
        cy.contains('button', 'Close').click()
        cy.wrap(onClose).should('have.been.called')
    })

    it('calls onImportDone when extraction completes', () => {
        const onImportDone = cy.stub()
        cy.mount(
            <ImportModal
                {...defaultProps}
                onImportDone={onImportDone}
                ExtractDataComponent={SuccessExtract}
            />
        )
        cy.wrap(onImportDone).should('have.been.called')
    })

    it('displays the error message when extraction fails', () => {
        cy.mount(
            <ImportModal
                {...defaultProps}
                ExtractDataComponent={ErrorExtract}
            />
        )
        cy.contains(friendlyErrorMessage).should('be.visible')
    })

    it('enables the Close button when extraction fails', () => {
        cy.mount(
            <ImportModal
                {...defaultProps}
                ExtractDataComponent={ErrorExtract}
            />
        )
        cy.contains('button', 'Close').should('not.be.disabled')
    })
})
