import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    InputField,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const mutation = {
    resource: 'routes',
    type: 'create',
    data: ({ data }) => data,
}

const RouteSetup = ({
    routeInfo,
    isRouteSetupModalOpen,
    setIsRouteSetupModalOpen,
}) => {
    const [token, setToken] = useState('')
    //token = CTBMDUGQBQD9SCHA
    if (routeInfo.auth.type == 'api-query-params') {
        routeInfo.auth.queryParams = {
            token: token,
        }
    } else if (routeInfo.auth.type == 'api-headers') {
        routeInfo.auth.headers = {
            'X-API-KEY': token,
        }
    }
    const [saveRoute] = useDataMutation(mutation, {
        variables: {
            data: routeInfo,
        },
        onComplete: () => {
            setIsRouteSetupModalOpen(!isRouteSetupModalOpen)
        },
    })

    return (
        <>
            <Modal>
                <ModalTitle>{i18n.t('Route set up')}</ModalTitle>
                <ModalContent>
                    <h3>
                        {i18n.t(
                            'Your route will be created with the following information ...'
                        )}
                    </h3>
                    <div>
                        <pre>{JSON.stringify(routeInfo, null, 2)}</pre>
                    </div>
                    <InputField
                        label={i18n.t('Token')}
                        value={token}
                        onChange={({ value }) => setToken(value)}
                    />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button
                            onClick={() =>
                                setIsRouteSetupModalOpen(!isRouteSetupModalOpen)
                            }
                            secondary
                        >
                            {i18n.t('Cancel')}
                        </Button>
                        <Button
                            disabled={!token}
                            onClick={() => saveRoute()}
                            primary
                        >
                            {i18n.t('Save')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        </>
    )
}

RouteSetup.propTypes = {
    isRouteSetupModalOpen: PropTypes.bool.isRequired,
    routeInfo: PropTypes.object.isRequired,
    setIsRouteSetupModalOpen: PropTypes.func.isRequired,
}

export default RouteSetup
