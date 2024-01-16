import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption, Divider } from "@dhis2/ui";
import useOrgUnitLevels from "../hooks/useOrgUnitLevels";

const OrgUnitLevel = ({ selected, onChange }) => {
  const { levels /*, error, loading */ } = useOrgUnitLevels();

  return levels ? (
    <div>
      <h2>{i18n.t("Organisation unit levels")}</h2>
      <SingleSelectField
        label={i18n.t("Organisation unit level to import data to")}
        selected={selected}
        onChange={({ selected }) => onChange(selected)}
      >
        {levels.map((l, i) => (
          <SingleSelectOption key={l.id} value={String(i + 1)} label={l.name} />
        ))}
      </SingleSelectField>
    </div>
  ) : null;
};

export default OrgUnitLevel;
