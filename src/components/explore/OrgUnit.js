import { useState, useEffect } from "react";
import { TabBar, Tab } from "@dhis2/ui";
import Temperature from "./Temperature";
import PrecipitationEra5 from "./Precipitation-ERA5";
import PrecipitationChirps from "./Precipitation-CHIRPS";
import useOrgUnit from "../../hooks/useOrgUnit";

const period = {
  startDate: "2023-01-01",
  endDate: "2023-12-31",
  // timeZone: "Africa/Addis_Ababa",
};

const OrgUnit = ({ id, name }) => {
  const [tab, setTab] = useState("temperature");
  const { orgUnit, error, loading } = useOrgUnit(id);

  return (
    <>
      <h1>{name}</h1>
      {orgUnit && (
        <>
          {orgUnit[0].geometry ? (
            <>
              <TabBar fixed>
                <Tab
                  onClick={() => setTab("temperature")}
                  selected={tab === "temperature"}
                >
                  Temperature
                </Tab>
                <Tab
                  onClick={() => setTab("precipitation")}
                  selected={tab === "precipitation"}
                >
                  Precipitation
                </Tab>
              </TabBar>
              {tab === "temperature" && (
                <Temperature orgUnit={orgUnit} period={period} />
              )}
              {tab === "precipitation" && (
                <>
                  <PrecipitationEra5 orgUnit={orgUnit} period={period} />
                  <PrecipitationChirps orgUnit={orgUnit} period={period} />
                </>
              )}
            </>
          ) : (
            <>No geometry</>
          )}
        </>
      )}
    </>
  );
};

export default OrgUnit;
