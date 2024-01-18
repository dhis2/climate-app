import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import datasets from "../data/datasets";
import classes from "./styles/Dataset.module.css";

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
