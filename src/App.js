import { useState } from "react";
import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import OrgUnits from "./OrgUnits";
import classes from "./App.module.css";

const MyApp = () => {
  const [startImport, setStartImport] = useState(false);

  return (
    <div className={classes.container}>
      {startImport ? (
        <OrgUnits />
      ) : (
        <Button primary onClick={() => setStartImport(true)}>
          {i18n.t("Import temperature data")}
        </Button>
      )}
    </div>
  );
};

export default MyApp;
