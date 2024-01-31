import { useState } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { IconLocation24, IconEmptyFrame24 } from "@dhis2/ui";
import PeriodTypeSelect from "./PeriodTypeSelect";
import DailyPeriodSelect from "./DailyPeriodSelect";
import Tabs from "./Tabs";
import TemperatureTab from "./TemperatureTab";
import PrecipitationTab from "./PrecipitationTab";
import ClimateChangeTab from "./ClimateChangeTab";
import DataSource from "./DataSource";
import useEarthEngineTimeSeries from "../../hooks/useEarthEngineTimeSeries";
import { defaultPeriod } from "../../utils/time";
import classes from "./styles/OrgUnit.module.css";

const band = [
  "temperature_2m",
  "temperature_2m_min",
  "temperature_2m_max",
  "total_precipitation_sum",
];

const reducer = ["mean", "min", "max", "mean"];

const monthlyDataset = {
  datasetId: "ECMWF/ERA5_LAND/MONTHLY_AGGR",
  band,
  reducer,
};

const dailyDataset = {
  datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
  band,
  reducer,
};

const monthlyPeriod = {
  startDate: "1970-01-01",
  endDate: "2030-01-01", // TODO: use current date
};

const tabs = {
  temperature: TemperatureTab,
  precipitation: PrecipitationTab,
  climatechange: ClimateChangeTab,
};

const OrgUnit = ({ orgUnit }) => {
  const [tab, setTab] = useState("temperature");
  const [dailyPeriod, setDailyPeriod] = useState(defaultPeriod);
  const [periodType, setPeriodType] = useState("monthly");

  const monthlyData = useEarthEngineTimeSeries(
    monthlyDataset,
    monthlyPeriod,
    orgUnit?.geometry
  );

  const dailyData = useEarthEngineTimeSeries(
    dailyDataset,
    dailyPeriod,
    orgUnit?.geometry
  );

  const Tab = tabs[tab];

  return (
    <div className={classes.orgUnit}>
      <h1>
        {orgUnit.properties.name}{" "}
        {orgUnit.geometry?.type === "Point" ? (
          <IconLocation24 />
        ) : (
          <IconEmptyFrame24 />
        )}
      </h1>

      {orgUnit.geometry ? (
        <>
          {monthlyData && dailyData ? (
            <>
              {tab !== "climatechange" && (
                <PeriodTypeSelect type={periodType} onChange={setPeriodType} />
              )}
              <Tabs selected={tab} onChange={setTab} />
              <div className={classes.tabContent}>
                <Tab
                  periodType={periodType}
                  monthlyData={monthlyData}
                  dailyData={dailyData}
                />
                {periodType === "daily" && tab !== "climatechange" && (
                  <DailyPeriodSelect
                    currentPeriod={dailyPeriod}
                    onUpdate={setDailyPeriod}
                  />
                )}
                <DataSource />
              </div>
            </>
          ) : (
            <div>{i18n.t("Loading data")}...</div>
          )}
        </>
      ) : (
        <>{i18n.t("No geometry")}</>
      )}
    </div>
  );
};

OrgUnit.propTypes = {
  orgUnit: PropTypes.object.isRequired,
};

export default OrgUnit;
