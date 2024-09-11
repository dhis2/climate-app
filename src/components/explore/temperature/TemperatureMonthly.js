import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";
import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import MonthlyPeriodSelect from "../MonthlyPeriodSelect";
import ReferencePeriod from "../ReferencePeriodSelect";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "./charts/temperatureMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../hooks/useEarthEngineClimateNormals";
import exploreStore from "../../../utils/exploreStore";
import { era5Monthly, era5MonthlyNormals } from "../../../data/datasets";

const TemperatureMonthly = ({ isPlugin }) => {
  const orgUnit = useOutletContext();
  const period = exploreStore((state) => state.monthlyPeriod);
  const referencePeriod = exploreStore((state) => state.referencePeriod);

  const data = useEarthEngineTimeSeries(era5Monthly, period, orgUnit);

  const normals = useEarthEngineClimateNormals(
    era5MonthlyNormals,
    referencePeriod,
    orgUnit
  );

  return (
    <>
      <PeriodTypeSelect />
      {data && normals ? (
        <Chart
          config={getMonthlyConfig(
            orgUnit.properties.name,
            data,
            normals,
            referencePeriod,
            isPlugin
          )}
          isPlugin={isPlugin}
        />
      ) : (
        <DataLoader />
      )}
      <MonthlyPeriodSelect />
      <ReferencePeriod />
    </>
  );
};

TemperatureMonthly.propTypes = {
  isPlugin: PropTypes.bool,
};

export default TemperatureMonthly;
