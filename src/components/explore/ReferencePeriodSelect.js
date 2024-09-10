import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import exploreStore from "../../utils/exploreStore";
import styles from "./styles/ReferencePeriod.module.css";

export const referencePeriods = [
  {
    id: "1991-2020",
    name: "1991 - 2020",
    startTime: 1991,
    endTime: 2020,
  },
  {
    id: "1961-1990",
    name: "1961 - 1990",
    startTime: 1961,
    endTime: 1990,
  },
];

export const defaultReferencePeriod = referencePeriods[0];

const ReferencePeriod = () => {
  const { referencePeriod, setReferencePeriod } = exploreStore();

  return (
    <div className={styles.referencePeriod}>
      <SingleSelectField
        label={i18n.t("Reference period")}
        selected={referencePeriod.id}
        onChange={({ selected }) =>
          setReferencePeriod(referencePeriods.find((p) => p.id === selected))
        }
      >
        {referencePeriods.map((p) => (
          <SingleSelectOption key={p.id} value={p.id} label={p.name} />
        ))}
      </SingleSelectField>
      <p></p>
    </div>
  );
};

export default ReferencePeriod;
