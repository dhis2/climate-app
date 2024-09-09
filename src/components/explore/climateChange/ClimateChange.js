import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import MonthSelect from "../MonthSelect";
import ReferencePeriod from "../ReferencePeriodSelect";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getChartConfig from "./charts/temperatureAnomaly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../hooks/useEarthEngineClimateNormals";
import exploreStore from "../../../utils/exploreStore";
import {
  era5MonthlyTemperatures,
  era5MonthlyNormals,
} from "../../../data/datasets";
import { getCurrentYear } from "../../../utils/time";
import styles from "./styles/ClimateChangeTab.module.css";

// Fetch all years from 1970 to the current year
const period = { startTime: "1970-01", endTime: `${getCurrentYear()}-12` };

const ClimateChange = () => {
  const orgUnit = useOutletContext();
  const month = exploreStore((state) => state.month);
  const referencePeriod = exploreStore((state) => state.referencePeriod);

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
    return <DataLoader />;
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
        <MonthSelect />
      </div>
      <ReferencePeriod />
    </>
  );
};

export default ClimateChange;
