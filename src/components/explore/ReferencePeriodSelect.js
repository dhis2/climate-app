import { useEffect } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import styles from "./styles/ReferencePeriod.module.css";

export const referencePeriods = [
  {
    id: "1991-2020",
    name: i18n.t("1991 - 2020"),
    startTime: 1991,
    endTime: 2020,
  },
  {
    id: "1961-1990",
    name: i18n.t("1961 - 1990"),
    startTime: 1961,
    endTime: 1990,
  },
];

export const defaultReferencePeriod = referencePeriods[0];

const ReferencePeriod = ({ selected, onChange }) => (
  <div className={styles.referencePeriod}>
    <SingleSelectField
      label={i18n.t("Reference period")}
      selected={selected}
      onChange={({ selected }) =>
        onChange(referencePeriods.find((p) => p.id === selected))
      }
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
