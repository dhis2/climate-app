import { TabBar, Tab } from "@dhis2/ui";

const tabs = [
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
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

export default Tabs;
