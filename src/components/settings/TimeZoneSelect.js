import { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";

const timeZones = Intl.supportedValuesOf("timeZone");

const TimeZoneSelect = () => {
  const [timeZone, setTimeZone] = useState();

  if (!timeZones) {
    return null;
  }

  return (
    <SingleSelectField
      filterable
      label={i18n.t("Time zone where your org units are located")}
      selected={timeZone}
      onChange={({ selected }) => setTimeZone(selected)}
    >
      {timeZones?.map((tz) => (
        <SingleSelectOption key={tz} value={tz} label={tz} />
      ))}
    </SingleSelectField>
  );
};

export default TimeZoneSelect;
