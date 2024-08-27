import { useOutletContext, useParams } from "react-router-dom";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "./charts/temperatureMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../hooks/useEarthEngineClimateNormals";
import explorePeriodStore from "../../../utils/explorePeriodStore";
import { era5Monthly, era5MonthlyNormals } from "../../../data/datasets";

const TemperatureMonthly = () => {
  const orgUnit = useOutletContext();
  const period = useParams();
  const { referencePeriod } = explorePeriodStore();

  const data = useEarthEngineTimeSeries(era5Monthly, period, orgUnit);

  const normals = useEarthEngineClimateNormals(
    era5MonthlyNormals,
    referencePeriod,
    orgUnit
  );

  if (!data || !normals) {
    return <DataLoader />;
  }

  return (
    <Chart
      config={getMonthlyConfig(
        orgUnit.properties.name,
        data,
        normals,
        referencePeriod
      )}
    />
  );
};

export default TemperatureMonthly;
