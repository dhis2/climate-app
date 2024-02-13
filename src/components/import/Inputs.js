import { useState, useEffect } from "react";
import { Card, Button } from "@dhis2/ui";
import Dataset from "./Dataset";
import Period from "./Period";
import OrgUnits from "./OrgUnits";
import DataElement from "./DataElement";
import ExtractData from "./ExtractData";
import { defaultPeriod } from "../../utils/time";
import classes from "./styles/Inputs.module.css";

const Inputs = () => {
  const [dataset, setDataset] = useState();
  const [period, setPeriod] = useState(defaultPeriod);
  const [orgUnits, setOrgUnits] = useState();
  const [dataElement, setDataElement] = useState();
  const [startExtract, setStartExtract] = useState(false);

  const isValidOrgUnits =
    orgUnits?.parent &&
    orgUnits?.level &&
    orgUnits.parent.path.split("/").length - 1 <= Number(orgUnits.level);

  const isValid =
    dataset &&
    period.startDate &&
    period.endDate &&
    isValidOrgUnits &&
    dataElement;

  useEffect(() => {
    setStartExtract(false);
  }, [dataset, period, orgUnits, dataElement]);

  return (
    <Card className={classes.card}>
      <div className={classes.container}>
        <Dataset selected={dataset} onChange={setDataset} />
        <Period period={period} onChange={setPeriod} />
        <OrgUnits selected={orgUnits} onChange={setOrgUnits} />
        <DataElement selected={dataElement} onChange={setDataElement} />
        <div className={classes.import}>
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
              orgUnits={orgUnits}
              dataElement={dataElement}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Inputs;
