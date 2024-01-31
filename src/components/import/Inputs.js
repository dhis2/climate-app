import { useState, useEffect } from "react";
import { Card, Button } from "@dhis2/ui";
import Dataset from "./Dataset";
import Period from "./Period";
import OrgUnitLevel from "./OrgUnitLevel";
import DataElement from "./DataElement";
import ExtractData from "./ExtractData";
import { defaultPeriod } from "../../utils/time";
import classes from "./styles/Inputs.module.css";

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

  useEffect(() => {
    setStartExtract(false);
  }, [dataset, period, orgUnitLevel, dataElement]);

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
          disabled={!isValid || startExtract}
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
