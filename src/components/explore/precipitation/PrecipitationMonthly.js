import { useOutletContext } from "react-router-dom";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "./charts/precipitationMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../hooks/useEarthEngineClimateNormals";
import exploreStore from "../../../utils/exploreStore";
import { era5Monthly, era5MonthlyNormals } from "../../../data/datasets";

const PrecipitationMonthly = () => {
  const orgUnit = useOutletContext();
  const monthlyPeriod = exploreStore((state) => state.monthlyPeriod);
  const referencePeriod = exploreStore((state) => state.referencePeriod);

  const data = useEarthEngineTimeSeries(era5Monthly, monthlyPeriod, orgUnit);

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

export default PrecipitationMonthly;
