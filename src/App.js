import { useState } from "react";
import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import Inputs from "./components/Inputs";
import Import from "./Import";
import Explore from "./components/explore/Explore";
import classes from "./App.module.css";

const MyApp = () => {
  const [startImport, setStartImport] = useState(false);
  const [startExplore, setStartExplore] = useState(false);

  return (
    <div className={classes.container}>
      {startImport ? (
        <Import />
      ) : startExplore ? (
        <Explore />
      ) : (
        <>
          <Button onClick={() => setStartImport(true)}>
            {i18n.t("Test: Import temperature data to DHIS2")}
          </Button>
          <br />
          <Button onClick={() => setStartExplore(true)}>
            {i18n.t("Explore: Look at data for one org unit")}
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
