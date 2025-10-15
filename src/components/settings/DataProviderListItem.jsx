import { useConfig } from '@dhis2/app-runtime'
// import i18n from '@dhis2/d2-i18n'
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
                                setProviderStatus('Online')
                            } else {
                                setProviderStatus('Offline')
                            }
                        })
                        .catch(() => {
                            setProviderStatus('Offline')
                        })
                } else {
                    setProviderStatus('Not configured')
                }
            } else if (dataProvider.statusCheck === 'geetoken') {
                tokenPromise
                    .then((token) =>
                        setProviderStatus(token ? 'Online' : 'Not configured')
                    )
                    .catch(() => setProviderStatus('Not configured'))
            }
        }
        pingDataProvider()
    }, [dataProvider, tokenPromise])

    const openInfo = ({ value }) => {
        setShowInfo(value)
    }

    const closeInfo = () => setShowInfo(null)

    const getInfo = useMemo(() => {
        if (!showInfo) {
            return null
        }

        if (showInfo.name === 'Google Earth Engine') {
            return 'Here is where the google earth engine instructions are'
        } else {
            return (
                <section aria-labelledby="enacts-setup-heading">
                    <h3 id="enacts-setup-heading">ENACTS set up information</h3>
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
                            <strong>name</strong>: <code>ENACTS API</code>
                        </li>
                        <li>
                            <strong>code</strong>: <code>enacts</code>
                        </li>
                        <li>
                            <strong>url</strong>:{' '}
                            <em>
                                The url where your ENACTS DST is hosted. You
                                must append &quot;/&#42;&#42;&quot; to the url
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
                                    <em>Your enacts api key here</em>
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
    "name": "ENACTS API",
    "code": "enacts",
    "url": "https://your-enacts-dst-url/**",
    "headers": {
        "Content-Type": "application/json",
        "X-API-Key": "Your enacts api key here"
    },
    "disabled": false
}`}
                    </pre>
                </section>
            )
        }
    }, [showInfo, docsVersion])

    return (
        <TableRow>
            <TableCell>{dataProvider.name}</TableCell>
            <TableCell>
                <div className={styles.dataProviderStatusDiv}>
                    {providerStatus && (
                        <div
                            className={cx(styles.dataProviderStatusIcon, {
                                [styles.dataProviderOnline]:
                                    providerStatus === 'Online',
                                [styles.dataProviderOffline]:
                                    providerStatus === 'Offline',
                                [styles.dataProviderMissing]:
                                    providerStatus === 'Missing',
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
                        value={dataProvider}
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
                        <ModalTitle>{showInfo.name} Info</ModalTitle>
                        <ModalContent>{getInfo}</ModalContent>
                        <ModalActions>
                            <Button onClick={closeInfo} primary>
                                Close
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
