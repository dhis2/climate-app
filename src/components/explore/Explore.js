import Temperature from "./Temperature";
// import TemperatureHourly from "./TemperatureHourly";
import PrecipitationEra5 from "./Precipitation-ERA5";
import PrecipitationChirps from "./Precipitation-CHIRPS";

const orgUnit = [
  {
    type: "Feature",
    id: "UqHuR4IYvTY",
    geometry: {
      type: "Point",
      coordinates: [-12.3786, 9.8371],
    },
    properties: {
      code: "OU_193246",
      name: "Sanya CHP",
      level: "4",
      parent: "Qhmi8IZyPyD",
      parentGraph: "ImspTQPwCqd/fdc6uOvgoji/Qhmi8IZyPyD",
      groups: ["GGghZsfu7qV", "uYxK4wmcPqA", "oRVt7g429ZO"],
    },
  },
];

const period = {
  startDate: "2023-01-01",
  endDate: "2023-12-31",
  // timeZone: "Africa/Addis_Ababa",
};

// <TemperatureHourly orgUnit={orgUnit} period={period} />
const Explore = () => {
  return (
    <div style={{ width: "90%", marginTop: 500 }}>
      <Temperature orgUnit={orgUnit} period={period} />
      <PrecipitationEra5 orgUnit={orgUnit} period={period} />
      <PrecipitationChirps orgUnit={orgUnit} period={period} />
    </div>
  );
};

export default Explore;
