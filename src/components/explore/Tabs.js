import PropTypes from "prop-types";
import { TabBar, Tab } from "@dhis2/ui";

const tabs = [
  { id: "forecast10days", label: "10 days forecast", pointOnly: true },
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
  { id: "humidity", label: "Humidity" },
  { id: "climatechange", label: "Climate change" },
  { id: "projections", label: "Climate projections" },
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
