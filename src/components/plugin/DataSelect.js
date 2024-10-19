import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";

const datasets = [
  {
    id: "forecast10days",
    name: "10 days forecast",
    path: "/forecast10days",
    // description: "Only available for facilities (points)",
    geometryType: "Point",
  },
];

const DataSelect = ({ value, onChange }) => (
  <div>
    <SingleSelectField
      label={i18n.t("Select data")}
      selected={value?.id}
      onChange={({ selected }) =>
        onChange(datasets.find((d) => d.id === selected))
      }
    >
      {datasets.map((d, i) => (
        <SingleSelectOption key={d.id} value={d.id} label={d.name} />
      ))}
    </SingleSelectField>
    {value && <p>{value.description}</p>}
  </div>
);

export default DataSelect;
