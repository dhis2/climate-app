import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
import ExplorePage from "./components/explore/ExplorePage";
import ImportPage from "./components/import/ImportPage";
import SetupPage from "./components/setup/SetupPage";
import SettingsPage from "./components/settings/SettingsPage";
import ErrorPage from "./components/ErrorPage";
import CheckPage from "./components/check/CheckPage";
import PluginPage from "./components/plugin/PluginPage";

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
        path: "explore/:orgUnitId?",
        element: <ExplorePage />,
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
      {
        path: "plugin",
        element: <PluginPage />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router}></RouterProvider>;

export default App;
