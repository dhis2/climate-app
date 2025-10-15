import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    TableRow,
    TableCell,
    Button,
    IconInfo16,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import useEarthEngineToken from '../../hooks/useEarthEngineToken.js'
import styles from './styles/DataProviderListItem.module.css'

const ONLINE = 'Online'
const OFFLINE = 'Offline'
const NOT_CONFIGURED = 'Not configured'

const DataProviderListItem = ({ dataProvider }) => {
    const [providerStatus, setProviderStatus] = useState(undefined)
    const [showInfo, setShowInfo] = useState(null)
    const tokenPromise = useEarthEngineToken()
    const buttonRef = useRef()
    const { serverVersion } = useConfig()
    const docsVersion = `${serverVersion.major}${serverVersion.minor}`

    useEffect(() => {
        const pingDataProvider = async () => {
            if (dataProvider.statusCheck === 'routehref') {
                if (dataProvider?.href) {
                    const pingUrl = `${dataProvider.href}/run` // TODO use 'info' when ENACTS api is implemented
                    fetch(pingUrl, { credentials: 'include' })
                        .then((response) => {
                            if (response.ok) {
                                setProviderStatus(ONLINE)
                            } else {
                                setProviderStatus(OFFLINE)
                            }
                        })
                        .catch(() => {
                            setProviderStatus(OFFLINE)
                        })
                } else {
                    setProviderStatus(NOT_CONFIGURED)
                }
            } else if (dataProvider.statusCheck === 'geetoken') {
                tokenPromise
                    .then((token) =>
                        setProviderStatus(token ? ONLINE : NOT_CONFIGURED)
                    )
                    .catch(() => setProviderStatus(NOT_CONFIGURED))
            }
        }
        pingDataProvider()
    }, [dataProvider, tokenPromise])

    const getInfo = useMemo(() => {
        if (!showInfo) {
            return null
        }

        if (showInfo === 'Google Earth Engine') {
            return (
                <section aria-labelledby="gee-setup-info">
                    <p>
                        To use Google Earth Engine, you must sign up and
                        authorize access. Please follow the instructions in the
                        official documentation:
                        <br />
                        <a
                            href="https://docs.dhis2.org/en/topics/tutorials/google-earth-engine-sign-up.html"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Google Earth Engine Setup Guide
                        </a>
                    </p>
                </section>
            )
        } else {
            return (
                <section aria-labelledby="enacts-setup-info">
                    <p>
                        The ENACTS api is made available using a DHIS2 route.
                        Follow the{' '}
                        <a
                            href={`https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-${docsVersion}/route.html`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            DHIS2 Routes documentation
                        </a>{' '}
                        to set up the route.
                    </p>
                    <p>
                        The following fields must be set in the route
                        configuration. Note that the <strong>code</strong> must
                        be <code>enacts</code>.
                    </p>
                    <ul>
                        <li>
                            <strong>name</strong>:{' '}
                            <em>
                                A short, descriptive name to identify the route
                            </em>
                        </li>
                        <li>
                            <strong>code</strong>: <code>enacts</code>
                        </li>
                        <li>
                            <strong>url</strong>:{' '}
                            <em>
                                The base url where your ENACTS DST API is
                                hosted. You must append &quot;/&#42;&#42;&quot;
                                to the url
                            </em>
                        </li>
                        <li>
                            <strong>headers</strong>:
                            <ul>
                                <li>
                                    <strong>Content-Type</strong>:{' '}
                                    <code>application/json</code>
                                </li>
                                <li>
                                    <strong>X-API-Key</strong>:{' '}
                                    <em>Your ENACTS DST API key here</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>disabled</strong>: <code>false</code>
                        </li>
                    </ul>
                    <p>Example configuration:</p>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {`{
    "name": "ENACTS Data Sharing Tool",
    "code": "enacts",
    "url": "https://your-enacts-dst-base-url/**",
    "headers": {
        "Content-Type": "application/json",
        "X-API-Key": "Your ENACTS DST API key here"
    },
    "disabled": false
}`}
                    </pre>
                </section>
            )
        }
    }, [showInfo, docsVersion])

    const openInfo = ({ value }) => setShowInfo(value)
    const closeInfo = () => setShowInfo(null)

    return (
        <TableRow>
            <TableCell>{dataProvider.name}</TableCell>
            <TableCell>
                <div className={styles.dataProviderStatusDiv}>
                    {providerStatus && (
                        <div
                            className={cx(styles.dataProviderStatusIcon, {
                                [styles.dataProviderOnline]:
                                    providerStatus === ONLINE,
                                [styles.dataProviderOffline]:
                                    providerStatus === OFFLINE,
                                [styles.dataProviderMissing]:
                                    providerStatus === NOT_CONFIGURED,
                            })}
                        ></div>
                    )}
                    {providerStatus ? (
                        <span>{providerStatus}</span>
                    ) : (
                        <CircularLoader extrasmall={true} />
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div ref={buttonRef}>
                    <Button
                        value={dataProvider.name}
                        icon={<IconInfo16 />}
                        onClick={openInfo}
                    ></Button>
                </div>
                {!!showInfo && (
                    <Modal
                        position="middle"
                        onClose={closeInfo}
                        dataTest="data-provider-info-modal"
                        large
                    >
                        <ModalTitle>
                            {i18n.t(`${showInfo} configuration`)}
                        </ModalTitle>
                        <ModalContent>{getInfo}</ModalContent>
                        <ModalActions>
                            <Button onClick={closeInfo} primary>
                                {i18n.t('Close')}
                            </Button>
                        </ModalActions>
                    </Modal>
                )}
            </TableCell>
        </TableRow>
    )
}

DataProviderListItem.propTypes = {
    dataProvider: PropTypes.shape({
        href: PropTypes.string,
        name: PropTypes.string,
        routeCode: PropTypes.string,
        statusCheck: PropTypes.string,
        url: PropTypes.any,
    }).isRequired,
}

export default DataProviderListItem
