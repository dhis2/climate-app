import PluginContent from "./PluginContent";
import DataLoader from "../shared/DataLoader";
import useOrgUnit from "../../hooks/useOrgUnit";

const OrgUnitLoader = (props) => {
  const orgUnit = useOrgUnit(props.orgUnitId);

  return orgUnit ? (
    <PluginContent {...props} orgUnit={orgUnit} />
  ) : (
    <DataLoader height="100%" />
  );
};

export default OrgUnitLoader;
