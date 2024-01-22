import { useDataMutation } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

const cocId = "HllvX50cXC0";

let dataImportMutation = {
  resource: "dataValueSets",
  type: "create",
  data: {
    dataValues: [],
  },
};

const ImportData = ({ data, dataElement }) => {
  const [isImporting, setIsImporting] = useState(true);

  const [mutate, { loading }] = useDataMutation(dataImportMutation);

  dataImportMutation.data.dataValues = data.map((obj) => {
    return {
      value: obj.value,
      orgUnit: obj.ou,
      dataElement: dataElement.id,
      period: obj.period,
      categoryOptionCombo: cocId,
      attributeOptionCombo: cocId,
    };
  });

  useEffect(() => {
    mutate(dataImportMutation).then(() => {
      setIsImporting(false);
    });
  }, []);

  if (isImporting) {
    return (
      <div>
        <br />
        Importing data ...
      </div>
    );
  }
  return (
    <div>
      <br />
      Data is imported
    </div>
  );
};

export default ImportData;
