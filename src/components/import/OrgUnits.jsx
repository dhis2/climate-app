import { OrgUnitDimension } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader, CenteredContent, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import useOrgUnitLevels from '../../hooks/useOrgUnitLevels.js'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots.js'
import useSystemInfo from '../../hooks/useSystemInfo.js'
import SectionH2 from '../shared/SectionH2.jsx'

const DEFAULT_SELECTED = []

const getOrgUnitsWarning = (featuresLoading, featuresError, featureCount) => {
    if (featuresLoading) {
        return null
    }
    if (featuresError?.message) {
        return featuresError.message
    }
    if (featureCount === 0) {
        return i18n.t('No org unit geometries found')
    }
    return null
}

const OrgUnits = ({
    selected = DEFAULT_SELECTED,
    onChange,
    featureCount,
    featuresLoading,
    featuresError,
}) => {
    const { roots, loading, error } = useOrgUnitRoots()
    const { levels, loading: levelsLoading } = useOrgUnitLevels()
    const { system } = useSystemInfo()

    const keyAnalysisDisplayProperty =
        system?.currentUser?.settings?.keyAnalysisDisplayProperty
    const displayNameProp =
        keyAnalysisDisplayProperty === 'name'
            ? 'displayName'
            : 'displayShortName'

    // Set for root node as default
    useEffect(() => {
        if (roots?.length > 0 && levels?.length > 0) {
            const [root] = roots
            const levelUnderRoot = levels[1]

            const defaultSelected = levelUnderRoot
                ? [
                      root,
                      {
                          id: `LEVEL-${levelUnderRoot.id}`,
                          name: levelUnderRoot.name,
                      },
                  ]
                : [root]
            onChange(defaultSelected)
        }
    }, [roots, levels, onChange])

    const onChangeOrgUnits = useCallback(
        (orgUnits) => onChange(orgUnits.items),
        [onChange]
    )

    const warning = getOrgUnitsWarning(
        featuresLoading,
        featuresError,
        featureCount
    )

    if (error?.message) {
        return (
            <div>
                <Help error>{error.message}</Help>
            </div>
        )
    } else if (loading || levelsLoading) {
        return (
            <div>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </div>
        )
    }

    return (
        <>
            <SectionH2 number="4" title={i18n.t('Select organisation units')} />
            <div data-test="org-units-selector">
                <OrgUnitDimension
                    roots={roots?.map((r) => r.id)}
                    selected={selected}
                    onSelect={onChangeOrgUnits}
                    hideUserOrgUnits={true}
                    warning={warning}
                    displayNameProp={displayNameProp}
                />
            </div>
        </>
    )
}

OrgUnits.propTypes = {
    onChange: PropTypes.func.isRequired,
    featureCount: PropTypes.number,
    featuresError: PropTypes.object,
    featuresLoading: PropTypes.bool,
    selected: PropTypes.array,
}

export default OrgUnits
