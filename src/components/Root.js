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
            <MenuItem label="Home" value="Home" href={"/#/"} />
            <MenuItem label="Import" value="Import" href={"/#/import"} />
            <MenuItem label="Explore" value="Explore" href={"/#/explore"} />
          </Menu>
          {pathname.startsWith("/explore") && <OrgUnitTree />}
        </div>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Root;
