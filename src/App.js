import { RouterProvider, Navigate, createHashRouter } from "react-router-dom";
import { useDataEngine } from "@dhis2/app-runtime";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
// import ExplorePage from "./components/explore/ExplorePage";
import OrgUnitRoute, { orgUnitLoader } from "./components/explore/OrgUnitRoute";
import TabsRoute from "./components/explore/TabsRoute";
import PeriodRoute from "./components/explore/PeriodRoute";
import TemperatureMonthly from "./components/explore/temperature/TemperatureMonthlyRoute";
import TemperatureDaily from "./components/explore/temperature/TemperatureDailyRoute";
import ImportPage from "./components/import/ImportPage";
import SetupPage from "./components/setup/SetupPage";
import SettingsPage from "./components/settings/SettingsPage";
import ErrorPage from "./components/ErrorPage";
import CheckPage from "./components/check/CheckPage";

const App = () => {
  const engine = useDataEngine();

  // https://tkdodo.eu/blog/react-query-meets-react-router
  const router = createHashRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <AboutPage />,
        },
        {
          path: "explore",
          children: [
            {
              index: true,
              element: <h2>Explore</h2>,
            },
            {
              path: ":orgUnitId",
              element: <OrgUnitRoute />,
              loader: orgUnitLoader(engine),
              children: [
                {
                  path: "temperature",
                  element: <TabsRoute />,
                  children: [
                    {
                      path: "monthly/:startTime/:endTime/:referencePeriodId",
                      element: <TemperatureMonthly />,
                    },
                    {
                      path: "daily/:startTime/:endTime",
                      element: <TemperatureDaily />,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: "check/:placeId?",
          element: <CheckPage />,
        },
        {
          path: "import",
          element: <ImportPage />,
        },
        {
          path: "setup",
          element: <SetupPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
