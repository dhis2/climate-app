import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import ExtractData from './ExtractData.jsx'

const ImportModal = ({
    dataset,
    period,
    features,
    dataElement,
    featurePayloadMbLimit,
    onClose,
    onImportDone,
    ExtractDataComponent = ExtractData,
}) => {
    const [importDone, setImportDone] = useState(false)

    const handleImportComplete = useCallback(() => {
        setImportDone(true)
        onImportDone?.()
    }, [onImportDone])

    return (
        <Modal
            large
            position="middle"
            onClose={importDone ? onClose : undefined}
        >
            <ModalTitle>{i18n.t('Importing climate data')}</ModalTitle>
            <ModalContent>
                <ExtractDataComponent
                    dataset={dataset}
                    period={period}
                    features={features}
                    dataElement={dataElement}
                    featurePayloadMbLimit={featurePayloadMbLimit}
                    onComplete={handleImportComplete}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button primary disabled={!importDone} onClick={onClose}>
                        {importDone ? i18n.t('Close') : i18n.t('Importing...')}
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
    featurePayloadMbLimit: PropTypes.number,
    period: PropTypes.object,
    onImportDone: PropTypes.func,
}

export default ImportModal
