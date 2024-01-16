import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import classes from "./styles/Dataset.module.css";

// kelvin to celsius with one decimal
const temperatureParser = (v) => Math.round((v - 273.15) * 10) / 10;

const datasets = [
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Temperature (ERA5-Land)"),
    description: i18n.t("Temperature in °C at 2m above the surface"),
    band: "temperature_2m",
    reducer: "mean",
    valueParser: temperatureParser,
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_max",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Max temperature (ERA5-Land)"),
    description: i18n.t("Max temperature in °C at 2m above the surface"),
    band: "temperature_2m_max",
    reducer: "max",
    valueParser: temperatureParser,
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_min",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Min temperature (ERA5-Land)"),
    description: i18n.t("Min temperature in °C at 2m above the surface"),
    band: "temperature_2m_min",
    reducer: "min",
    valueParser: temperatureParser,
  },
];

const Dataset = ({ selected, onChange }) => {
  return (
    <div className={classes.container}>
      <h2>{i18n.t("Data")}</h2>
      <SingleSelectField
        label={i18n.t("Select data to import")}
        selected={selected?.id}
        onChange={({ selected }) =>
          onChange(datasets.find((d) => d.id === selected))
        }
      >
        {datasets.map((d, i) => (
          <SingleSelectOption key={d.id} value={d.id} label={d.name} />
        ))}
      </SingleSelectField>
      {selected && <p>{selected.description}</p>}
    </div>
  );
};

export default Dataset;
