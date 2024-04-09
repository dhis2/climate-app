import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import { appPages } from "../Root";

const StartPageSelect = ({ startPage, onChange }) => (
  <SingleSelectField
    filterable
    label={i18n.t("Default start page for users")}
    selected={startPage || appPages[0].path}
    onChange={({ selected }) => onChange("startPage", selected)}
  >
    {appPages.map(({ path, name }) => (
      <SingleSelectOption key={path} value={path} label={name} />
    ))}
  </SingleSelectField>
);

StartPageSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  startPage: PropTypes.string,
};

export default StartPageSelect;
