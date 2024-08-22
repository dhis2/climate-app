import { DashboardPluginWrapper } from "@dhis2/analytics";
import React from "react";
import Plugin from "./Plugin.js";

const DashboardPlugin = (props) => {
  console.log("DashboardPlugin props", props);

  return (
    <DashboardPluginWrapper {...props}>
      {(propsFromParent) => <Plugin {...propsFromParent} />}
    </DashboardPluginWrapper>
  );
};

export default DashboardPlugin;
