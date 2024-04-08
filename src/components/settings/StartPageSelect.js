import { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import { appPages } from "../Root";

const StartPageSelect = () => {
  const [startPage, setStartPage] = useState(appPages[0].path);

  return (
    <SingleSelectField
      filterable
      label={i18n.t("Default start page for users")}
      selected={startPage}
      onChange={({ selected }) => setStartPage(selected)}
    >
      {appPages.map(({ path, name }) => (
        <SingleSelectOption key={path} value={path} label={name} />
      ))}
    </SingleSelectField>
  );
};

export default StartPageSelect;
