import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { useDataMutation } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";
import ImportResponse from "./ImportResponse";
import ImportError from "./ImportError";
import styles from "./styles/ImportData.module.css";

const dataImportMutation = {
  resource: "dataValueSets",
  type: "create",
  data: (dataValues) => dataValues,
};

const ImportData = ({ data, dataElement }) => {
  const [response, setResponse] = useState(false);
  const [mutate, { error }] = useDataMutation(dataImportMutation);

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
        setResponse(response.response);
      } else if (response.status === "SUCCESS") {
        setResponse(response);
      }
    });
  }, [mutate, data, dataElement]);

  return (
    <div className={styles.container}>
      {response ? (
        <ImportResponse {...response} />
      ) : error?.details ? (
        <ImportError {...error.details} />
      ) : (
        i18n.t("Importing data to DHIS2")
      )}
    </div>
  );
};

ImportData.propTypes = {
  data: PropTypes.array.isRequired,
  dataElement: PropTypes.object.isRequired,
};

export default ImportData;
