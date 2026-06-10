import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import useEarthEngineData from '../../hooks/useEarthEngineData.js'
import DataLoader from '../shared/DataLoader.jsx'
import ImportData from './ImportData.jsx'

const ExtractGeeData = ({
    dataElement,
    dataset,
    period,
    features,
    onError,
    onSuccess,
}) => {
    const { data, error, progress } = useEarthEngineData({
        dataset,
        period,
        features,
    })

    // Keep a stable ref so the effect below only re-fires when `error`
    // changes, not when the parent re-creates the `onError` callback.
    // Without this, a 400 from GEE triggers recordRun → new configs →
    // new onError ref → effect re-fires → infinite recordRun loop.
    const onErrorRef = useRef(onError)
    onErrorRef.current = onError

    useEffect(() => {
        if (error) {
            onErrorRef.current?.()
        }
    }, [error])

    if (error) {
        const displayError = /payload size exceeds the limit/i.test(error)
            ? i18n.t(
                  'An org unit in your selection has boundaries that are too detailed to process.'
              )
            : error
        return (
            <NoticeBox error title={i18n.t('Import failed')}>
                {displayError}
            </NoticeBox>
        )
    }

    if (!data) {
        let loadingLabel
        if (progress.total > 1) {
            loadingLabel = i18n.t(
                'Extracting data from Google Earth Engine (batch {{current}} of {{total}})',
                {
                    current: progress.current,
                    total: progress.total,
                    nsSeparator: ';',
                }
            )
        } else {
            loadingLabel = i18n.t('Extracting data from Google Earth Engine')
        }
        return <DataLoader label={loadingLabel} height={100} />
    }

    return (
        <ImportData
            data={data}
            dataElement={dataElement}
            features={features}
            period={period}
            onError={onError}
            onSuccess={onSuccess}
        />
    )
}

ExtractGeeData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
}

export default ExtractGeeData
