import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";

const Legend = ({ name, items }) => (
  <table>
    <caption>
      {i18n.t("Legend")}: "{name}"
    </caption>
    <thead>
      <tr>
        <th>{i18n.t("Name")}</th>
        <th>{i18n.t("Start value")}</th>
        <th>{i18n.t("End value")}</th>
        <th>{i18n.t("Color")}</th>
      </tr>
    </thead>
    <tbody>
      {items.map(({ name, from, to, hexColor, textColor }) => (
        <tr key={hexColor}>
          <td>{name}</td>
          <td>{from}</td>
          <td>{to}</td>
          <td
            style={{
              backgroundColor: hexColor,
              color: textColor,
            }}
          >
            {hexColor}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

Legend.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Legend;
