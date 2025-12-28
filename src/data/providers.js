// define list of data provider route codes that can be registered

export const PROVIDER_GEE = 'gee'
export const PROVIDER_ENACTS = 'enacts'

export const dataProviders = [
    {
        id: PROVIDER_GEE,
        name: 'Google Earth Engine',
        nameShort: 'Earth Engine',
        statusCheck: 'geetoken',
    },
    {
        id: PROVIDER_ENACTS,
        routeCode: PROVIDER_ENACTS,
        name: 'ENACTS Data Sharing Tool (DST)',
        nameShort: 'ENACTS',
        statusCheck: 'routehref',
    },
]
