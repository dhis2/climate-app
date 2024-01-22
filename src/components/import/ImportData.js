import { useDataMutation } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

const dataImportMutation = {
  resource: "dataValueSets",
  type: "create",
  data: (dataValues) => dataValues,
};

const ImportData = ({ data, dataElement }) => {
  const [isImported, setIsImported] = useState(false);
  const [mutate] = useDataMutation(dataImportMutation);

  useEffect(() => {
    // const cocId = dataElement.categoryCombo.categoryOptionCombos[0].id;

    // Is cocId needed?
    mutate({
      dataValues: data.map((obj) => ({
        value: obj.value,
        orgUnit: obj.ou,
        dataElement: dataElement.id,
        period: obj.period,
        // categoryOptionCombo: cocId,
        // attributeOptionCombo: cocId,
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
      {isImported ? "Data is imported" : "Importing data to DHIS2"}
    </div>
  );
};

export default ImportData;
