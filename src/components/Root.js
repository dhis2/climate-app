import { Fragment, useEffect } from "react";
import { CssVariables, CssReset, Menu, MenuItem } from "@dhis2/ui";
import { Outlet, useResolvedPath, useNavigate } from "react-router-dom";
import styles from "./styles/Root.module.css";
import OrgUnitTree from "./explore/OrgUnitTree";
import useAppSettings from "../hooks/useAppSettings";
import useEarthEngineLastTime from "../hooks/useEarthEngineLastTime";

export const appPages = [
  { path: "/", name: "Home" },
  { path: "/explore", name: "Explore data" },
  { path: "/import", name: "Import data" },
  { path: "/setup", name: "Setup guide" },
  { path: "/settings", name: "Settings" },
];

const Root = () => {
  const { data } = useEarthEngineLastTime("ECMWF/ERA5_LAND/DAILY_AGGR");
  const { settings } = useAppSettings();
  const { pathname } = useResolvedPath();
  const navigate = useNavigate();

  console.log("time", data);

  useEffect(() => {
    if (pathname === "/" && settings.startPage) {
      navigate(settings.startPage);
    }
  }, [settings]);

  return (
    <>
      <CssReset />
      <CssVariables spacers colors />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Menu>
            {appPages.map(({ path, name }) => (
              <Fragment key={path}>
                <MenuItem
                  label={name}
                  href={`#${path}`}
                  active={
                    pathname === path ||
                    (path !== "/" && pathname.startsWith(path))
                  }
                />
                {path === "/explore" && pathname.startsWith("/explore") && (
                  <OrgUnitTree />
                )}
              </Fragment>
            ))}
          </Menu>
        </div>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Root;
