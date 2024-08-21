import { DashboardPluginWrapper } from "@dhis2/analytics";
import React, { useEffect, useState } from "react";
import Plugin from "./Plugin.js";

const DashboardPlugin = (props) => {
  const [propsFromParent, setPropsFromParent] = useState(props);

  // TODO: can props be passed directly to DashboardPluginWrapper?
  useEffect(() => setPropsFromParent(props), [props]);

  return (
    <DashboardPluginWrapper {...propsFromParent}>
      {(props) => <Plugin {...props} />}
    </DashboardPluginWrapper>
  );
};

export default DashboardPlugin;
