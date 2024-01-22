import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import AboutPage from "./components/AboutPage";
import ErrorPage from "./components/ErrorPage";
import ImportPage from "./components/import/ImportPage";
import ExplorePage from "./components/explore/ExplorePage";

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
        path: "import",
        element: <ImportPage />,
      },
      {
        path: "explore/:orgUnitId?",
        element: <ExplorePage />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router}></RouterProvider>;

export default App;
