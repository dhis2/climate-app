import i18n from "@dhis2/d2-i18n";
import { CircularLoader } from "@dhis2/ui";
import useOrgUnits from "../hooks/useOrgUnits";
import useEarthEngineData from "../hooks/useEarthEngineData";
import classes from "./styles/ExtractData.module.css";

const oneDay = 1000 * 60 * 60 * 24;

const ExtractData = ({ dataset, period, orgUnitLevel }) => {
  const { features /* , error, loading */ } = useOrgUnits(orgUnitLevel);
  const data = useEarthEngineData(dataset, period, features);

  if (!data) {
    if (!features) {
      return (
        <div className={classes.container}>
          <CircularLoader small className={classes.loader} />{" "}
          {i18n.t("Loading org units")}
        </div>
      );
    }

    const orgUnits = features.length;
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);

    const days = Math.round(
      (endDate.getTime() + oneDay - startDate.getTime()) / oneDay
    );

    const count = days * orgUnits;

    return (
      <div className={classes.container}>
        <CircularLoader small className={classes.loader} />
        {i18n.t(
          "Extracting data for {{days}} days and {{orgUnits}} org units ({{count}} values)",
          {
            days,
            orgUnits,
            count,
          }
        )}
      </div>
    );
  }

  console.log("ExtractData", data);

  return <div className={classes.container}>Data is extracted</div>;
};

export default ExtractData;
