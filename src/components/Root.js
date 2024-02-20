import { CssVariables, CssReset, Menu, MenuItem } from "@dhis2/ui";
import { Outlet, useResolvedPath } from "react-router-dom";
import styles from "./styles/Root.module.css";
import OrgUnitTree from "./explore/OrgUnitTree";

const Root = () => {
  const { pathname } = useResolvedPath();

  return (
    <>
      <CssReset />
      <CssVariables spacers colors />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Menu>
            <MenuItem label="Home" href={"/#/"} active={pathname === "/"} />
            <MenuItem
              label="Explore data"
              href={"/#/explore"}
              active={pathname.startsWith("/explore")}
            />
            {pathname.startsWith("/explore") && <OrgUnitTree />}
            <MenuItem
              label="Import data"
              href={"/#/import"}
              active={pathname.startsWith("/import")}
            />
            <MenuItem
              label="Import metadata"
              href={"/#/metadata"}
              active={pathname.startsWith("/metadata")}
            />
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
