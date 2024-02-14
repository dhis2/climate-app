import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
import ExplorePage from "./components/explore/ExplorePage";
import ImportPage from "./components/import/ImportPage";
import MetadataPage from "./components/MetadataPage";
import ErrorPage from "./components/ErrorPage";

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
        path: "import",
        element: <ImportPage />,
      },
      {
        path: "metadata",
        element: <MetadataPage />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router}></RouterProvider>;

export default App;
