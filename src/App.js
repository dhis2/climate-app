import { useState } from "react";
import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import OrgUnits from "./OrgUnits";
import Import from "./Import";
import classes from "./App.module.css";

const MyApp = () => {
  const [startExtract, setStartExtract] = useState(false);
  const [startImport, setStartImport] = useState(false);

  return (
    <div className={classes.container}>
      {startExtract ? (
        <OrgUnits />
      ) : startImport ? (
        <Import />
      ) : (
        <>
          <Button primary onClick={() => setStartExtract(true)}>
            {i18n.t("Extract temperature data")}
          </Button>
          <br></br>
          <Button onClick={() => setStartImport(true)}>
            {i18n.t("Import temperature data")}
          </Button>
        </>
      )}
    </div>
  );
};

export default MyApp;
