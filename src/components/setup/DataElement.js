import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";

const DataElement = ({
  name,
  shortName,
  dataElementCode,
  description,
  aggregationType,
}) => (
  <table>
    <caption>
      {i18n.t("Data element")}: "{name}"
    </caption>
    <tbody>
      <tr>
        <th>{i18n.t("Name")}</th>
        <td>{name}</td>
      </tr>
      <tr>
        <th>{i18n.t("Short name")}</th>
        <td>{shortName}</td>
      </tr>
      <tr>
        <th>{i18n.t("Code")}</th>
        <td>{dataElementCode}</td>
      </tr>
      <tr>
        <th>{i18n.t("Description")}</th>
        <td>{description}</td>
      </tr>
      <tr>
        <th>{i18n.t("Domain type")}</th>
        <td>{i18n.t("Aggregate")}</td>
      </tr>
      <tr>
        <th>{i18n.t("Aggregation type")}</th>
        <td>{aggregationType}</td>
      </tr>
      <tr>
        <th>{i18n.t("Aggregation levels")}</th>
        <td>
          <em>{i18n.t("Assign all org unit levels")}</em>
        </td>
      </tr>
    </tbody>
  </table>
);

DataElement.propTypes = {
  name: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  dataElementCode: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  aggregationType: PropTypes.string.isRequired,
};

export default DataElement;
