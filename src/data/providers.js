
// define list of data provider route codes that can be registered
const dataProviders = [
    {
        id: 'gee',
        name: 'Google Earth Engine',
        nameShort: 'Earth Engine',
        url: '<placeholder url...>', //`${apiUrl}`, // need a way to access the route url here
    },
    {
        id: 'enacts',
        routeCode: 'enacts-test',
        name: 'ENACTS Data Sharing Tool (DST)',
        nameShort: 'ENACTS',
        url: '<placeholder url...>', //`${apiUrl}`, // need a way to access the route url here
    },
]

export default dataProviders
