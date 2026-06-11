import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ExtractData from './ExtractData.jsx'

const ImportModal = ({
    dataset,
    period,
    features,
    dataElement,
    savedConfig,
    onClose,
    onImportDone,
    ExtractDataComponent = ExtractData,
}) => {
    const [importSettled, setImportSettled] = useState(false)
    const [importSucceeded, setImportSucceeded] = useState(false)

    const handleSuccess = useCallback(
        (importCount, noDataMessage) => {
            setImportSettled(true)
            setImportSucceeded(true)
            onImportDone?.(importCount, noDataMessage)
        },
        [onImportDone]
    )

    const handleError = useCallback(
        (err) => {
            setImportSettled(true)
            if (err != null) {
                const errMessage =
                    err?.message ?? err?.toString?.() ?? i18n.t('Unknown error')
                onImportDone?.(null, errMessage)
            }
        },
        [onImportDone]
    )

    return (
        <Modal
            large
            position="middle"
            onClose={importSettled ? onClose : undefined}
        >
            <ModalTitle>{i18n.t('Importing climate data')}</ModalTitle>
            <ModalContent>
                <ExtractDataComponent
                    dataset={dataset}
                    period={period}
                    features={features}
                    dataElement={dataElement}
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
                {importSettled && importSucceeded && savedConfig && (
                    <NoticeBox
                        valid
                        title={i18n.t('Saved as "{{name}}"', {
                            name: savedConfig.name,
                            nsSeparator: ';',
                        })}
                    >
                        <Link to="/import">{i18n.t('View in Imports →')}</Link>
                    </NoticeBox>
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button primary disabled={!importSettled} onClick={onClose}>
                        {importSettled
                            ? i18n.t('Close')
                            : i18n.t('Importing...')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

ImportModal.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    ExtractDataComponent: PropTypes.elementType,
    period: PropTypes.object,
    savedConfig: PropTypes.object,
    onImportDone: PropTypes.func,
}

export default ImportModal
