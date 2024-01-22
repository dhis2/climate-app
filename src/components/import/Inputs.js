import { useState } from "react";
import { Card, Button } from "@dhis2/ui";
import Dataset from "./Dataset";
import Period from "./Period";
import OrgUnitLevel from "./OrgUnitLevel";
import DataElement from "./DataElement";
import ExtractData from "./ExtractData";
import classes from "./styles/Inputs.module.css";

// TODO: Make dynamic
const defaultPeriod = {
  startDate: "2023-07-01",
  endDate: "2023-07-10",
  // timeZone: "Africa/Addis_Ababa",
};

const Inputs = () => {
  const [dataset, setDataset] = useState();
  const [period, setPeriod] = useState(defaultPeriod);
  const [orgUnitLevel, setOrgUnitLevel] = useState();
  const [dataElement, setDataElement] = useState();
  const [startExtract, setStartExtract] = useState(false);

  const isValid =
    dataset &&
    period.startDate &&
    period.endDate &&
    orgUnitLevel &&
    dataElement;

  return (
    <Card>
      <div className={classes.container}>
        <Dataset selected={dataset} onChange={setDataset} />
        <Period period={period} onChange={setPeriod} />
        <OrgUnitLevel selected={orgUnitLevel} onChange={setOrgUnitLevel} />
        <DataElement selected={dataElement} onChange={setDataElement} />
        <br />
        <Button
          primary
          disabled={!isValid}
          onClick={() => setStartExtract(true)}
        >
          Start import
        </Button>
        {startExtract && (
          <ExtractData
            dataset={dataset}
            period={period}
            orgUnitLevel={orgUnitLevel}
            dataElement={dataElement}
          />
        )}
      </div>
    </Card>
  );
};

export default Inputs;
