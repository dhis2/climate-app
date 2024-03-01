import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";

export const months = [
  {
    id: "01",
    name: i18n.t("January"),
  },
  {
    id: "02",
    name: i18n.t("February"),
  },
  {
    id: "03",
    name: i18n.t("March"),
  },
  {
    id: "04",
    name: i18n.t("April"),
  },
  {
    id: "05",
    name: i18n.t("May"),
  },
  {
    id: "06",
    name: i18n.t("June"),
  },
  {
    id: "07",
    name: i18n.t("July"),
  },
  {
    id: "08",
    name: i18n.t("August"),
  },
  {
    id: "09",
    name: i18n.t("September"),
  },
  {
    id: "10",
    name: i18n.t("October"),
  },
  {
    id: "11",
    name: i18n.t("November"),
  },
  {
    id: "12",
    name: i18n.t("December"),
  },
];

const MonthSelect = ({ selected, onChange }) => (
  <SingleSelectField
    label={i18n.t("Month")}
    selected={selected}
    onChange={({ selected }) => onChange(selected)}
  >
    {months.map((d) => (
      <SingleSelectOption key={d.id} value={d.id} label={d.name} />
    ))}
  </SingleSelectField>
);

MonthSelect.propTypes = {
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MonthSelect;
