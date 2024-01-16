import { useState } from "react";
import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import Inputs from "./components/Inputs";
import Import from "./Import";
import classes from "./App.module.css";

const MyApp = () => {
  const [startImport, setStartImport] = useState(false);

  return (
    <div className={classes.container}>
      {startImport ? (
        <Import />
      ) : (
        <>
          <Button onClick={() => setStartImport(true)}>
            {i18n.t("Test: Import temperature data to DHIS2")}
          </Button>
          <br />
          <br />
          <br />
          <Inputs />
        </>
      )}
    </div>
  );
};

export default MyApp;
