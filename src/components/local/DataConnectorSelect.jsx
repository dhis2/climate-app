import { useState, useEffect } from 'react'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import useAppSettings from '../../hooks/useAppSettings.js'

const DataConnectorSelect = ({selected, onChange}) => {
    const { settings, changeSetting } = useAppSettings()

    if (!settings) {return null}

    const { dataConnectors = [] } = settings

    return (
        <>
            {dataConnectors && (
                <>
                    <SingleSelect selected={selected} onChange={onChange}>
                        {dataConnectors.map(d => (
                            <SingleSelectOption key={d.id} value={d.id} label={d.name}/>
                        ))}
                    </SingleSelect>
                </>
            )}
            {!dataConnectors && (
                <>
                    <p>No data servers have been added. Please go to the Settings page to configure server connections.</p>
                </>
            )}
        </>
    )
}

export default DataConnectorSelect