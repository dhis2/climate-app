import i18n from "@dhis2/d2-i18n";
import { useDataMutation } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

const dataImportMutation = {
  resource: "dataValueSets",
  type: "create",
  data: (dataValues) => dataValues,
};

const ImportData = ({ data, dataElement, onImportComplete }) => {
  const [isImported, setIsImported] = useState(false);
  const [mutate] = useDataMutation(dataImportMutation);

  useEffect(() => {
    mutate({
      dataValues: data.map((obj) => ({
        value: obj.value,
        orgUnit: obj.ou,
        dataElement: dataElement.id,
        period: obj.period,
      })),
    }).then((response) => {
      if (response.httpStatus === "OK") {
        setIsImported(true);
      } else {
        // TODO: Handle error
      }
    });
  }, [mutate, data, dataElement]);

  return (
    <div>
      <br />
      {isImported
        ? i18n.t("Data is imported")
        : i18n.t("Importing data to DHIS2")}
    </div>
  );
};

export default ImportData;
