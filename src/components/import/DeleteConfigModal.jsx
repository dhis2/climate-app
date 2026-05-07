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
import classes from './styles/DeleteConfigModal.module.css'

const formatDate = (iso) => {
    if (!iso) {
        return ''
    }
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) {
        return iso
    }
    return d.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

const DeleteConfigModal = ({ config, onCancel, onConfirm }) => (
    <Modal small onClose={onCancel} position="middle">
        <ModalTitle>
            {i18n.t('Delete "{{name}}"?', {
                name: config.name,
                nsSeparator: ';',
            })}
        </ModalTitle>
        <ModalContent>
            <div className={classes.body}>
                {config.createdByName && config.createdAt && (
                    <p className={classes.attribution}>
                        {i18n.t('Created by {{name}} on {{date}}.', {
                            name: config.createdByName,
                            date: formatDate(config.createdAt),
                            nsSeparator: ';',
                        })}
                    </p>
                )}
                <p>
                    {i18n.t(
                        'Deleting will remove the saved import and its update history. Imported data values in DHIS2 will not be affected.'
                    )}
                </p>
            </div>
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>
                <Button destructive onClick={onConfirm}>
                    {i18n.t('Delete')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

DeleteConfigModal.propTypes = {
    config: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        createdAt: PropTypes.string,
        createdByName: PropTypes.string,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
}

export default DeleteConfigModal
