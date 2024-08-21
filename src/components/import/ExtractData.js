import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import useOrgUnits from "../../hooks/useOrgUnits";
import useEarthEngineData from "../../hooks/useEarthEngineData";
import ImportData from "./ImportData";
import DataLoader from "../shared/DataLoader";
import ErrorMessage from "../shared/ErrorMessage";
import { getNumberOfDaysFromPeriod } from "../../utils/time";
import styles from "./styles/ExtractData.module.css";

const ExtractData = ({ dataset, period, orgUnits, dataElement }) => {
  const { parent, level } = orgUnits;
  const { features } = useOrgUnits(parent.id, level);
  const { data, error, loading } = useEarthEngineData(
    dataset,
    period,
    features
  );

  if (!features) {
    return <DataLoader label={i18n.t("Loading org units")} height={100} />;
  } else if (!features.length) {
    return (
      <div className={styles.container}>
        {i18n.t("No org units with geometry found for this level")}
      </div>
    );
  }
  const orgUnitsCount = features.length;
  const daysCount = getNumberOfDaysFromPeriod(period);
  const valueCount = daysCount * orgUnitsCount;

  if (loading) {
    return (
      <DataLoader
        label={i18n.t(
          "Extracting data for {{daysCount}} days and {{orgUnitsCount}} org units ({{valueCount}} values)",
          {
            daysCount,
            orgUnitsCount,
            valueCount,
          }
        )}
      />
    );
  }

  return error ? (
    <ErrorMessage error={error} />
  ) : (
    <ImportData data={data} dataElement={dataElement} features={features} />
  );
};

ExtractData.propTypes = {
  dataset: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
  orgUnits: PropTypes.object.isRequired,
  dataElement: PropTypes.object.isRequired,
};

export default ExtractData;
