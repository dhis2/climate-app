import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { TabBar, Tab } from "@dhis2/ui";

const tabs = [
  { id: "forecast10days", label: i18n.t("10 days forecast"), pointOnly: true },
  { id: "temperature", label: i18n.t("Temperature") },
  { id: "precipitation", label: i18n.t("Precipitation") },
  { id: "humidity", label: i18n.t("Humidity") },
  { id: "heat", label: i18n.t("Heat") },
  { id: "climatechange", label: i18n.t("Climate change") },
];

const Tabs = ({ selected, isPoint, onChange }) => (
  <TabBar fixed>
    {tabs
      .filter((t) => !t.pointOnly || t.pointOnly === isPoint)
      .map(({ id, label }) => (
        <Tab key={id} selected={selected === id} onClick={() => onChange(id)}>
          {label}
        </Tab>
      ))}
  </TabBar>
);

Tabs.propTypes = {
  selected: PropTypes.string.isRequired,
  isPoint: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Tabs;
