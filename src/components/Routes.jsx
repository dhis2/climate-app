import { useDataEngine } from '@dhis2/app-runtime'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import checkPlaceLoader from '../utils/checkPlaceLoader.js'
import orgUnitLoader from '../utils/orgUnitLoader.js'
import AboutPage from './AboutPage.jsx'
import CheckPage from './check/CheckPage.jsx'
import ErrorPage from './ErrorPage.jsx'
import ClimateChange from './explore/climateChange/ClimateChange.jsx'
import Elevation from './explore/elevation/Elevation.jsx'
import ExplorePage from './explore/ExplorePage.jsx'
import LocalPage from './local/LocalPage.jsx'
import Forecast from './explore/forecast/Forecast.jsx'
import HeatDaily from './explore/heat/HeatDaily.jsx'
import HeatMonthly from './explore/heat/HeatMonthly.jsx'
import HumidityDaily from './explore/humidity/HumidityDaily.jsx'
import HumidityMonthly from './explore/humidity/HumidityMonthly.jsx'
import ExploreOrgUnit from './explore/OrgUnit.jsx'
import LocalOrgUnit from './local/OrgUnit.jsx'
import PrecipitationDaily from './explore/precipitation/PrecipitationDaily.jsx'
import PrecipitationMonthly from './explore/precipitation/PrecipitationMonthly.jsx'
import BuiltinDatasetTabs from './explore/BuiltinDatasetTabs.jsx'
import TemperatureDaily from './explore/temperature/TemperatureDaily.jsx'
import TemperatureMonthly from './explore/temperature/TemperatureMonthly.jsx'
import Vegetation from './explore/vegetation/Vegetation.jsx'
import ImportPage from './import/ImportPage.jsx'
import Root from './Root.jsx'
import SettingsPage from './settings/SettingsPage.jsx'
import SetupPage from './setup/SetupPage.jsx'
import { fetchDataConnectorDatasets } from '../utils/dataConnector.js'

const monthlyPath = 'monthly/:startTime/:endTime/:referencePeriodId'
const dailyPath = 'daily/:startTime/:endTime'

// Shared routes for explore and check sections
const builtinDatasetRoutes = [
    {
        path: 'forecast10days',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                index: true,
                element: <Forecast />,
            },
        ],
    },
    {
        path: 'temperature',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                path: monthlyPath,
                element: <TemperatureMonthly />,
            },
            {
                path: dailyPath,
                element: <TemperatureDaily />,
            },
        ],
    },
    {
        path: 'precipitation',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                path: monthlyPath,
                element: <PrecipitationMonthly />,
            },
            {
                path: dailyPath,
                element: <PrecipitationDaily />,
            },
        ],
    },
    {
        path: 'humidity',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                path: monthlyPath,
                element: <HumidityMonthly />,
            },
            {
                path: dailyPath,
                element: <HumidityDaily />,
            },
        ],
    },
    {
        path: 'heat',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                path: 'monthly/:startTime/:endTime',
                element: <HeatMonthly />,
            },
            {
                path: dailyPath,
                element: <HeatDaily />,
            },
        ],
    },
    {
        path: 'climatechange',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                path: ':month/:referencePeriodId',
                element: <ClimateChange />,
            },
        ],
    },
    {
        path: 'vegetation',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                path: ':vegetationIndex',
                element: <Vegetation />,
            },
        ],
    },
    {
        path: 'elevation',
        element: <BuiltinDatasetTabs />,
        children: [
            {
                index: true,
                element: <Elevation />,
            },
        ],
    },
]

/*
const serverDatasetRoutes = ({serverId}) => {
    const datasets = fetchDataConnectorDatasets({host: serverId})
    const datasetRoutes = []
    datasets.map(ds => {
        datasetRoutes.push(
            {
                path: ds.id,
                element: <ServerTabs />,
                children: [
                    {
                        index: true,
                        element: <ServerDatasetVisualizer />,
                    },
                ],
            }
        )
    })
    return datasetRoutes
}
*/

const Routes = () => {
    const engine = useDataEngine()

    const router = createHashRouter([
        {
            path: '/',
            element: <Root />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/',
                    element: <AboutPage />,
                },
                {
                    path: 'explore',
                    children: [
                        {
                            index: true,
                            element: <ExplorePage />,
                        },
                        {
                            path: ':orgUnitId',
                            element: <ExploreOrgUnit />,
                            loader: orgUnitLoader(engine),
                            children: builtinDatasetRoutes,
                        },
                    ],
                },
                {
                    path: 'local',
                    children: [
                        {
                            index: true,
                            element: <LocalPage />,
                        },
                        {
                            path: ':orgUnitId',
                            element: <LocalOrgUnit />,
                            loader: orgUnitLoader(engine),
                            children: [
                                {
                                    path: ':serverId',
                                    element: <LocalOrgUnit />,
                                    loader: orgUnitLoader(engine),
                                    children: [
                                        {
                                            path: ':datasetId',
                                            element: <LocalOrgUnit />,
                                            loader: orgUnitLoader(engine),
                                        },
                                    ]
                                },
                            ]
                        },
                    ],
                },
                {
                    path: 'check',
                    children: [
                        {
                            index: true,
                            element: <CheckPage />,
                        },
                        {
                            path: ':placeId',
                            element: <ExploreOrgUnit />,
                            loader: checkPlaceLoader,
                            children: builtinDatasetRoutes,
                        },
                    ],
                },
                {
                    path: 'import',
                    element: <ImportPage />,
                },
                {
                    path: 'setup',
                    element: <SetupPage />,
                },
                {
                    path: 'settings',
                    element: <SettingsPage />,
                },
            ],
        },
    ])

    return <RouterProvider router={router}></RouterProvider>
}

export default Routes
