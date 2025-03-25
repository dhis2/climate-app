import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import legend from '../../../data/pm2.5-legend.js'
import useGetRoute from '../../../hooks/useGetRoute.js'
import Chart from '../../explore/Chart.jsx'
import RouteSetup from '../../setup/RouteSetup.jsx'
import getChartConfig from '../charts/AirQualityGauge.js'
import styles from './styles/AirQoPlugin.module.css'

const AirQoPlugin = ({ siteId }) => {
    const engine = useDataEngine()
    const [data, setData] = useState()
    const { route } = useGetRoute()

    const [isRouteSetupModalOpen, setIsRouteSetupModalOpen] = useState(false)

    const routeInfo = {
        name: 'AirQo',
        code: 'airqo',
        disabled: false,
        url: 'https://api.airqo.net/api/v2/devices/measurements/sites/**',
        auth: {
            type: 'api-query-params',
        },
    }

    useEffect(() => {
        if (route && route.id && !data) {
            const resource = `routes/${route.id}/run/${siteId}/recent`

            engine
                .query({
                    routes: { resource },
                })
                .then((response) => {
                    setData(response?.routes?.measurements?.[0])
                })
                .catch((error) => {
                    console.error('Error fetching airqo data:', error)
                })
        }
    }, [route, data])

    if (!route || !route.id) {
        return (
            <div className={styles.margin}>
                <NoticeBox warning title={i18n.t('Missing route')}>
                    {i18n.t('AirQo token not set')}
                </NoticeBox>

                <div className={styles.margin}>
                    <Button
                        onClick={() => setIsRouteSetupModalOpen(true)}
                        primary
                    >
                        {i18n.t('Create route')}
                    </Button>
                    {isRouteSetupModalOpen && (
                        <RouteSetup
                            routeInfo={routeInfo}
                            isRouteSetupModalOpen={isRouteSetupModalOpen}
                            setIsRouteSetupModalOpen={setIsRouteSetupModalOpen}
                        />
                    )}
                </div>
            </div>
        )
    }

    if (!data) {
        return <CircularLoader className={styles.margin} />
    }

    const {
        siteDetails: { name, city },
        aqi_category: category,
        pm2_5: { value: pm2_5 },
        pm10: { value: pm10 },
        time,
    } = data

    const description = legend.items.find(
        (item) => item.category === category
    )?.description

    const formattedTime = new Date(time).toLocaleTimeString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    return data ? (
        <div className={styles.container}>
            <Chart
                config={getChartConfig(
                    `${name}, ${city}`,
                    pm2_5,
                    category,
                    formattedTime
                )}
            />
            {description && (
                <div className={styles.description}>{description}</div>
            )}
        </div>
    ) : null
}

AirQoPlugin.propTypes = {
    siteId: PropTypes.string.isRequired,
}

export default AirQoPlugin
