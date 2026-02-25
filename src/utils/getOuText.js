import i18n from '../locales/index.js'

// This function has been adapted from @dhis2/analytics src/modules/getOuLevelAndGroupText.js

const LEVEL_ID_PREFIX = 'LEVEL'
const GROUP_ID_PREFIX = 'OU_GROUP'

const hasGroupPrefix = (id) =>
    id.substr(0, GROUP_ID_PREFIX.length) === GROUP_ID_PREFIX

const hasLevelPrefix = (id) =>
    id.substr(0, LEVEL_ID_PREFIX.length) === LEVEL_ID_PREFIX

const stripLevelPrefix = (id) =>
    hasLevelPrefix(id) ? id.substr(LEVEL_ID_PREFIX.length + 1) : id

const stripGroupPrefix = (id) =>
    hasGroupPrefix(id) ? id.substr(GROUP_ID_PREFIX.length + 1) : id

const removePrefix = (id) => stripGroupPrefix(stripLevelPrefix(id))

const ouIdHelper = Object.freeze({
    addLevelPrefix: (id) => `${LEVEL_ID_PREFIX}-${removePrefix(id)}`,
    addGroupPrefix: (id) => `${GROUP_ID_PREFIX}-${removePrefix(id)}`,
    removePrefix,
    hasGroupPrefix,
    hasLevelPrefix,
})

export const getOuText = (items) => {
    if (
        items.some(
            ({ id }) =>
                ouIdHelper.hasGroupPrefix(id) || ouIdHelper.hasLevelPrefix(id)
        )
    ) {
        return getOuLevelAndGroupText(items)
    }

    return items
        .map((item) => item.name)
        .filter(Boolean)
        .join(', ')
}

const getOuLevelAndGroupText = (items) => {
    const hasOuLevel = items.some((item) => ouIdHelper.hasLevelPrefix(item.id))
    const hasOuGroup = items.some((item) => ouIdHelper.hasGroupPrefix(item.id))

    const filterFragments = []

    if (hasOuGroup) {
        filterFragments.push(getLevelAndGroupText(items, false))
    }

    if (hasOuLevel) {
        filterFragments.push(getLevelAndGroupText(items, true))
    }

    return filterFragments.join(' - ')
}

const getLevelAndGroupText = (items, isLevel) => {
    const dynamicOuItems = items.filter((item) =>
        isLevel
            ? ouIdHelper.hasLevelPrefix(item.id)
            : ouIdHelper.hasGroupPrefix(item.id)
    )
    const lastItem = dynamicOuItems.length > 1 ? dynamicOuItems.pop() : null
    const dynamicOuNames = dynamicOuItems.map((item) => item.name).join(', ')

    let allDynamicOuNames

    if (lastItem) {
        const lastOuName = lastItem.name

        allDynamicOuNames = i18n.t('{{dynamicOuNames}} and {{lastOuName}}', {
            dynamicOuNames,
            lastOuName,
            interpolation: { escapeValue: false },
        })
    } else {
        allDynamicOuNames = dynamicOuNames
    }

    const staticOuNames = items
        .filter(
            (item) =>
                !ouIdHelper.hasGroupPrefix(item.id) &&
                !ouIdHelper.hasLevelPrefix(item.id)
        )
        .map((item) => item.name)
        .join(', ')

    let ouLevelAndGroupText = ''
    if (staticOuNames) {
        if (isLevel) {
            ouLevelAndGroupText = i18n.t(
                '{{allDynamicOuNames}} levels in {{staticOuNames}}',
                {
                    allDynamicOuNames,
                    staticOuNames,
                    interpolation: { escapeValue: false },
                }
            )
        } else {
            ouLevelAndGroupText = i18n.t(
                '{{allDynamicOuNames}} groups in {{staticOuNames}}',
                {
                    allDynamicOuNames,
                    staticOuNames,
                    interpolation: { escapeValue: false },
                }
            )
        }
    } else {
        if (isLevel) {
            ouLevelAndGroupText = i18n.t('{{allDynamicOuNames}} levels', {
                allDynamicOuNames,
                interpolation: { escapeValue: false },
            })
        } else {
            ouLevelAndGroupText = i18n.t('{{allDynamicOuNames}} groups', {
                allDynamicOuNames,
                interpolation: { escapeValue: false },
            })
        }
    }

    return ouLevelAndGroupText
}
