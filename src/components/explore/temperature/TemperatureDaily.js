import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";
import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import DailyPeriodSelect from "../DailyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import getDailyConfig from "./charts/temperatureDaily";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../utils/exploreStore";
import { era5Daily } from "../../../data/datasets";

const TemperatureDaily = ({ isPlugin }) => {
  const orgUnit = useOutletContext();
  const period = exploreStore((state) => state.dailyPeriod);

  const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit);

  return (
    <>
      <PeriodTypeSelect />
      {data ? (
        <Chart
          config={getDailyConfig(orgUnit.properties.name, data, isPlugin)}
          isPlugin={isPlugin}
        />
      ) : (
        <DataLoader />
      )}
      <DailyPeriodSelect />
    </>
  );
};

TemperatureDaily.propTypes = {
  isPlugin: PropTypes.bool,
};

export default TemperatureDaily;
