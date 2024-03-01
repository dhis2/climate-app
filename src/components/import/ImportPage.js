import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import { Card, Button } from "@dhis2/ui";
import Dataset from "./Dataset";
import Period from "./Period";
import OrgUnits from "./OrgUnits";
import DataElement from "./DataElement";
import ExtractData from "./ExtractData";
import { defaultPeriod } from "../../utils/time";
import styles from "./styles/ImportPage.module.css";

const Page = () => {
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
    <div className={styles.page}>
      <h1>{i18n.t("Import weather and climate data")}</h1>
      <div className={styles.column}>
        <Card className={styles.card}>
          <div className={styles.container}>
            <Dataset
              selected={dataset}
              onChange={(dataset) => {
                setDataset(dataset);
                setDataElement(null);
              }}
            />
            <Period period={period} onChange={setPeriod} />
            <OrgUnits selected={orgUnits} onChange={setOrgUnits} />
            <DataElement
              selected={dataElement}
              dataset={dataset}
              onChange={setDataElement}
            />
            <div className={styles.import}>
              <Button
                primary
                disabled={!isValid || startExtract}
                onClick={() => setStartExtract(true)}
              >
                Start import
              </Button>
              {startExtract && isValid && (
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
        <div className={styles.instructions}>
          <h2>{i18n.t("Instructions")}</h2>
          <p>
            {i18n.t(
              "Before you can import weather and climate data, you need to create the associated data elements in DHIS2. See our setup guide in the left menu."
            )}
          </p>
          <p>
            {i18n.t(
              "Data can be imported in batches. We recommend that you start with a few organisation units to make sure everything works as expected."
            )}
          </p>
          <p>
            <strong>{i18n.t("Data")}</strong>:{" "}
            {i18n.t(
              "Select the ERA5-Land variable you would like to import. So far we only support temperature (average, min, max) and precipitation."
            )}
          </p>
          <p>
            <strong>{i18n.t("Period")}</strong>:{" "}
            {i18n.t(
              "Select the start and end dates for your import. We will import daily data for the selected period. You can aggregate data to other period types (weekly/monthly) in DHIS2. If your DHIS2 instance use a different timezone than UTC, we will calculate daily values based on this timezone."
            )}
          </p>
          <p>
            <strong>{i18n.t("Parent organisation unit")}</strong>:{" "}
            {i18n.t(
              "Select a parent organisation unit for the import. We will import data for children that are below this organisation unit."
            )}
          </p>
          <p>
            <strong>{i18n.t("Organisation unit level")}</strong>:{" "}
            {i18n.t(
              "Select the organisation unit level for the import. We will import data for this level that are below the parent organisation unit. If the parent organisation unit is on the same level, we will import data for this single organisation unit."
            )}
          </p>
          <p>
            <strong>{i18n.t("Data element")}</strong>:{" "}
            {i18n.t(
              "Select the DHIS2 data element you would like to import the data into. See the “Setup guide” for more information on how to configure this data element."
            )}
          </p>
          <p>
            <strong>{i18n.t("Import summary")}</strong>:{" "}
            {i18n.t(
              "When data is imported, we will show a summary of the import. This includes the number of data values that were successfully imported or updated. If data values fail to import, we will show the reason for the failure."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
