import { Fragment } from "react";
import { CssVariables, CssReset, Menu, MenuItem } from "@dhis2/ui";
import { Outlet, useResolvedPath } from "react-router-dom";
import styles from "./styles/Root.module.css";
import OrgUnitTree from "./explore/OrgUnitTree";

export const appPages = [
  { path: "/", name: "Home" },
  { path: "/explore", name: "Explore data" },
  { path: "/import", name: "Import data" },
  { path: "/setup", name: "Setup guide" },
  { path: "/settings", name: "Settings" },
];

const Root = () => {
  const { pathname } = useResolvedPath();

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
