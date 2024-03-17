import PropTypes from "prop-types";
import { TabBar, Tab } from "@dhis2/ui";

const tabs = [
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
  { id: "humidity", label: "Humidity" },
  { id: "climatechange", label: "Climate change" },
];

const Tabs = ({ selected, onChange }) => (
  <TabBar fixed>
    {tabs.map(({ id, label }) => (
      <Tab key={id} selected={selected === id} onClick={() => onChange(id)}>
        {label}
      </Tab>
    ))}
  </TabBar>
);

Tabs.propTypes = {
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Tabs;
