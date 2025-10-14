import i18n from '@dhis2/d2-i18n'
import { CircularLoader, TableRow, TableCell } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styles from './styles/DataProviderListItem.module.css'

const DataProviderListItem = ({ dataProvider, index }) => {
    const [providerStatus, setProviderStatus] = useState(undefined)

    useEffect(() => {
        const pingDataProvider = async () => {
            if (dataProvider?.href) {
                const pingUrl = `${dataProvider.href}/run` // not sure if the base url is enough for pinging
                fetch(pingUrl, { credentials: 'include' }) // needed to pass on dhis2 login credentials
                    .then((response) => {
                        //console.log('pinging', pingUrl, response.ok, response)
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
                setProviderStatus('Missing')
            }
        }
        pingDataProvider()
    }, [dataProvider])

    const statusClassMap = {
        Online: styles.dataProviderOnline,
        Offline: styles.dataProviderOffline,
        Missing: styles.dataProviderMissing,
    }

    const statusClass = statusClassMap[providerStatus]
    console.log(statusClass)

    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{dataProvider.name}</TableCell>
            <TableCell>{dataProvider.routeCode}</TableCell>
            <TableCell>
                {dataProvider?.url === undefined
                    ? i18n.t(
                          'Please go to the Routes API and register a Route with the code "{{code}}"',
                          { code: dataProvider.routeCode }
                      )
                    : String(dataProvider.url)}
            </TableCell>
            <TableCell>
                <div className={`${styles.dataProviderStatusDiv}`}>
                    {providerStatus && (
                        <div
                            className={cx(
                                styles.dataProviderStatusIcon,
                                styles.statusClass
                            )}
                        ></div>
                    )}
                    {providerStatus && <span>{providerStatus}</span>}
                    {!providerStatus && <CircularLoader extrasmall={true} />}
                </div>
            </TableCell>
        </TableRow>
    )
}

DataProviderListItem.propTypes = {
    dataProvider: PropTypes.shape({
        href: PropTypes.string,
        name: PropTypes.string,
        routeCode: PropTypes.string,
        url: PropTypes.any,
    }).isRequired,
    index: PropTypes.number.isRequired,
}

export default DataProviderListItem
