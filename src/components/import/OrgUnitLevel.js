import i18n from "@dhis2/d2-i18n";
import { useEffect } from "react";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import useOrgUnitLevels from "../../hooks/useOrgUnitLevels";

const OrgUnitLevel = ({ level, onChange }) => {
  const { levels } = useOrgUnitLevels();

  // Set second level as default
  useEffect(() => {
    if (levels?.length > 1 && !level) {
      onChange(String(levels[1].level));
    }
  }, [levels, level, onChange]);

  return levels ? (
    <div>
      <h2>{i18n.t("Organisation unit level")}</h2>
      <SingleSelectField
        label={i18n.t("Organisation unit level to import data to")}
        selected={level}
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
