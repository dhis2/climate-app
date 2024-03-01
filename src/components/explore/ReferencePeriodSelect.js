import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import styles from "./styles/ReferencePeriod.module.css";

export const referencePeriods = [
  {
    id: "1991-2020",
    name: i18n.t("1991 - 2020"),
    startYear: 1991,
    endYear: 2020,
  },
  {
    id: "1961-1990",
    name: i18n.t("1961 - 1990"),
    startYear: 1961,
    endYear: 1990,
  },
];

const ReferencePeriod = ({ selected, onChange }) => (
  <div className={styles.referencePeriod}>
    <SingleSelectField
      label={i18n.t("Reference period")}
      selected={selected}
      onChange={({ selected }) => onChange(selected)}
    >
      {referencePeriods.map((p) => (
        <SingleSelectOption key={p.id} value={p.id} label={p.name} />
      ))}
    </SingleSelectField>
    <p></p>
  </div>
);

ReferencePeriod.propTypes = {
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ReferencePeriod;
