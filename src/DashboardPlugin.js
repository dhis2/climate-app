import { DashboardPluginWrapper } from "@dhis2/analytics";
import React from "react";
import Plugin from "./components/plugin/Plugin.js";

const DashboardPlugin = (props) => {
  console.log("DashboardPlugin props", props);
  return (
    <DashboardPluginWrapper {...props}>
      {(parentProps) => <Plugin {...parentProps} />}
    </DashboardPluginWrapper>
  );
};

export default DashboardPlugin;
