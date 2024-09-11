// import PluginItems from "./PluginItems";
import OrgUnitLoader from "./OrgUnitLoader";

// TODO: Keep in data store
const pluginItems = [
  {
    id: "DiszpKrYNg8/forecast10days",
    url: "#/explore/DiszpKrYNg8/forecast10days",
    title: "Ngelehun CHC: Weather forecast",
    orgUnitId: "DiszpKrYNg8",
    display: "forecast10days",
  },
  {
    id: "DiszpKrYNg8/temperature/monthly",
    url: "#/explore/DiszpKrYNg8/temperature/monthly/2023-09/2024-08/1991-2020",
    title: "Ngelehun CHC: Monthly temperatures 2023-2024",
    orgUnitId: "DiszpKrYNg8",
    display: "temperature/monthly",
    period: { startTime: "2023-09", endTime: "2024-08" },
    referencePeriod: { id: "1991-2020", startTime: 1991, endTime: 2020 },
  },
  {
    id: "DiszpKrYNg8/temperature/daily",
    url: "#/explore/DiszpKrYNg8/temperature/daily/2023-09-01/2024-08-31",
    title: "Ngelehun CHC: Daily Temperatures 2023-2024",
    orgUnitId: "DiszpKrYNg8",
    display: "temperature/daily",
    period: { startTime: "2023-08-01", endTime: "2024-07-12" },
  },
];

// TODO: Keep in data store
const dashboardItems = {
  tf116s7c3YO: "DiszpKrYNg8/forecast10days",
};

const Plugin = (props) => {
  /*
  const { dashboardItemId } = props;
  const pluginItemId = dashboardItems[dashboardItemId];

  if (!pluginItemId) {
    <PluginItems items={pluginItems} />;
  }

  const pluginItem = pluginItems.find((item) => item.id === pluginItemId);

  if (!pluginItem) {
    return <div>Plugin item not found (this should not happen)</div>;
  }
  */

  console.log("Plugin props", props);

  const pluginItem = pluginItems[1];

  if (props.setDashboardItemDetails) {
    props.setDashboardItemDetails({
      itemTitle: pluginItem.title,
      appUrl: pluginItem.url,
    });
  }

  return <OrgUnitLoader {...pluginItem} {...props} />;
};

export default Plugin;
