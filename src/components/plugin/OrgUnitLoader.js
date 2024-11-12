import { useEffect } from "react";
import PluginContent from "./PluginContent";
import DataLoader from "../shared/DataLoader";
import exploreStore from "../../store/exploreStore";
import useOrgUnit from "../../hooks/useOrgUnit";

const OrgUnitLoader = (props) => {
  const loadedOrgUnit = useOrgUnit(props.orgUnitId);
  const { orgUnit, setOrgUnit } = exploreStore();

  useEffect(() => {
    setOrgUnit(loadedOrgUnit);
    return () => {
      setOrgUnit(null);
    };
  }, [loadedOrgUnit]);

  return orgUnit ? <PluginContent {...props} /> : <DataLoader height="100%" />;
};

export default OrgUnitLoader;
