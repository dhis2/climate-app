import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import styles from "./styles/DataSelect.module.css";

export const datasets = [
  {
    id: "forecast10days",
    name: "10 days forecast",
    path: "/forecast10days",
    geometryType: "Point",
  },
];

const DataSelect = ({ value, onChange }) => {
  const dataset = datasets.find((d) => d.id === value);
  return (
    <div className={styles.dataSelect}>
      <SingleSelectField
        label={i18n.t("Choose a data source")}
        selected={value}
        onChange={({ selected }) => onChange(selected)}
      >
        {datasets.map((d, i) => (
          <SingleSelectOption key={d.id} value={d.id} label={d.name} />
        ))}
      </SingleSelectField>
      {dataset?.description && <p>{dataset.description}</p>}
    </div>
  );
};

export default DataSelect;
