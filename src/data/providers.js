// define list of data provider route codes that can be registered

export const PROVIDER_GEE = 'gee'

export const dataProviders = [
    {
        id: PROVIDER_GEE,
        name: 'Google Earth Engine',
        nameShort: 'Earth Engine',
        statusCheck: 'geetoken',
    },
]
