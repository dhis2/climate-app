import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import Chart from '../../explore/Chart.jsx'
import getChartConfig from '../charts/AirQualityGauge.js'
import legend from '../../../data/pm2.5-legend.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import styles from './styles/AirQoPlugin.module.css'
import useGetRoute from '../../../hooks/useGetRoute.js'

const AirQoPlugin = ({ siteId }) => {
    const engine = useDataEngine()
    const [data, setData] = useState()
    const { settings = {} } = useAppSettings()
    const { route } = useGetRoute()
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
        return <div>{i18n.t('AirQo token not set')}</div>
    }

    if (!data) {
        return <div>{i18n.t('Loading...')}</div>
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

export default AirQoPlugin
