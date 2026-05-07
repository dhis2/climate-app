import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    InputField,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState } from 'react'

const SaveConfigModal = ({ onSave, onClose }) => {
    const [name, setName] = useState('')

    return (
        <Modal position="middle" onClose={onClose}>
            <ModalTitle>{i18n.t('Save import configuration')}</ModalTitle>
            <ModalContent>
                <InputField
                    label={i18n.t('Configuration name')}
                    value={name}
                    onChange={({ value }) => setName(value)}
                    placeholder={i18n.t('E.g. ERA5 Monthly Temperature')}
                    autoFocus
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        primary
                        onClick={() => onSave(name.trim())}
                        disabled={!name.trim()}
                    >
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

SaveConfigModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
}

export default SaveConfigModal
