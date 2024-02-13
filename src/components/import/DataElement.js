import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { useDataQuery } from "@dhis2/app-runtime";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";

const dataElementQuery = {
  results: {
    resource: "dataElements",
    params: {
      paging: false,
      filter: "domainType:eq:AGGREGATE",
      fields:
        "id,displayName,dataSetElements[id,dataSet[id,displayName,categoryCombo[categoryOptionCombos[id,displayName]]]],categoryCombo[categoryOptionCombos[id,displayName]]",
    },
  },
};

const DataElement = ({ selected, onChange }) => {
  const { loading, error, data } = useDataQuery(dataElementQuery);

  return (
    <div>
      <h2>{i18n.t("Data element")}</h2>
      <SingleSelectField
        filterable
        noMatchText={i18n.t("No match found")}
        label={i18n.t("Data element to import data to")}
        selected={selected?.id}
        onChange={({ selected }) =>
          onChange(data?.results?.dataElements.find((d) => d.id === selected))
        }
      >
        {data?.results?.dataElements.map((d) => (
          <SingleSelectOption key={d.id} value={d.id} label={d.displayName} />
        ))}
      </SingleSelectField>
    </div>
  );
};

DataElement.propTypes = {
  selected: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default DataElement;
