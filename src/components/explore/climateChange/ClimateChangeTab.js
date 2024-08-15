import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import MonthSelect from "../MonthSelect";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getChartConfig from "./charts/temperatureAnomaly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../hooks/useEarthEngineClimateNormals";
import {
  era5MonthlyTemperatures,
  era5MonthlyNormals,
} from "../../../data/datasets";
import styles from "./styles/ClimateChangeTab.module.css";

// TODO: Make this dynamic
const period = { startTime: "1970-01", endTime: "2024-08" };

const ClimateChangeTab = ({ orgUnit, referencePeriod }) => {
  const [month, setMonth] = useState(
    // monthlyData.slice(-1)[0].id.substring(5, 7) // Last month available
    "01"
  );

  const filters = useMemo(
    () => [
      {
        type: "calendarRange",
        arguments: [parseInt(month), parseInt(month), "month"],
      },
    ],
    [month]
  );

  const data = useEarthEngineTimeSeries(
    era5MonthlyTemperatures,
    period,
    orgUnit,
    filters
  );

  const normals = useEarthEngineClimateNormals(
    era5MonthlyNormals,
    referencePeriod,
    orgUnit
  );

  if (!data || !normals) {
    return <DataLoader height={400} />;
  }

  return (
    <>
      <Chart
        config={getChartConfig(
          orgUnit.properties.name,
          data,
          normals,
          month,
          referencePeriod
        )}
      />
      <div className={styles.monthSelect}>
        <MonthSelect selected={month} onChange={setMonth} />
      </div>
    </>
  );
};

ClimateChangeTab.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default ClimateChangeTab;
