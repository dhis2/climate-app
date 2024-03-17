import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import OrgUnitType from "./OrgUnitType";
import PeriodTypeSelect from "./PeriodTypeSelect";
import DailyPeriodSelect from "./DailyPeriodSelect";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import ReferencePeriodSelect from "./ReferencePeriodSelect";
import Tabs from "./Tabs";
import TemperatureTab from "./TemperatureTab";
import PrecipitationTab from "./PrecipitationTab";
import HumidityTab from "./HumidityTab";
import ClimateChangeTab from "./ClimateChangeTab";
import DataLoader from "../shared/DataLoader";
import useEarthEngineTimeSeries from "../../hooks/useEarthEngineTimeSeries";
import { defaultPeriod, defaultReferencePeriod } from "../../utils/time";
import styles from "./styles/OrgUnit.module.css";

const band = [
  "temperature_2m",
  "temperature_2m_min",
  "temperature_2m_max",
  "dewpoint_temperature_2m",
  "total_precipitation_sum",
];

const reducer = ["mean", "min", "max", "mean", "mean"];

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

const allMonthsPeriod = {
  startDate: "1960-01",
  endDate: new Date().toISOString().substring(0, 7), // Current month
};

const tabs = {
  temperature: TemperatureTab,
  precipitation: PrecipitationTab,
  humidity: HumidityTab,
  climatechange: ClimateChangeTab,
};

const OrgUnit = ({ orgUnit }) => {
  const [tab, setTab] = useState("temperature");
  const [dailyPeriod, setDailyPeriod] = useState(defaultPeriod);
  const [monthlyPeriod, setMonthlyPeriod] = useState();
  const [referencePeriod, setReferencePeriod] = useState(
    defaultReferencePeriod
  );
  const [periodType, setPeriodType] = useState("monthly");

  const monthlyData = useEarthEngineTimeSeries(
    monthlyDataset,
    allMonthsPeriod,
    orgUnit?.geometry
  );

  const dailyData = useEarthEngineTimeSeries(
    dailyDataset,
    dailyPeriod,
    orgUnit?.geometry
  );

  const Tab = tabs[tab];

  useEffect(() => {
    if (monthlyData && !monthlyPeriod) {
      const last12months = monthlyData.slice(-12);
      setMonthlyPeriod({
        startMonth: last12months[0].id,
        endMonth: last12months[11].id,
      });
    }
  }, [monthlyPeriod, monthlyData]);

  return (
    <div className={styles.orgUnit}>
      <h1>
        {orgUnit.properties.name} <OrgUnitType type={orgUnit.geometry?.type} />
      </h1>

      {orgUnit.geometry ? (
        <>
          {monthlyData && dailyData && monthlyPeriod ? (
            <>
              {tab !== "climatechange" && (
                <PeriodTypeSelect type={periodType} onChange={setPeriodType} />
              )}
              <Tabs selected={tab} onChange={setTab} />
              <div className={styles.tabContent}>
                <Tab
                  name={orgUnit.properties.name}
                  periodType={periodType}
                  monthlyData={monthlyData}
                  dailyData={dailyData}
                  monthlyPeriod={monthlyPeriod}
                  referencePeriod={referencePeriod}
                />
                {tab !== "climatechange" && (
                  <>
                    {periodType === "daily" ? (
                      <DailyPeriodSelect
                        currentPeriod={dailyPeriod}
                        onUpdate={setDailyPeriod}
                      />
                    ) : (
                      monthlyPeriod && (
                        <MonthlyPeriodSelect
                          currentPeriod={monthlyPeriod}
                          onUpdate={setMonthlyPeriod}
                        />
                      )
                    )}
                  </>
                )}
                {(tab === "climatechange" || periodType === "monthly") && (
                  <ReferencePeriodSelect
                    selected={referencePeriod}
                    onChange={setReferencePeriod}
                  />
                )}
                {tab === "climatechange" && (
                  <div className={styles.description}>
                    {i18n.t(
                      "Temperature anomaly is the difference of a temperature from a reference value, calculated as the average temperature over a period of 30 years. Blue columns shows temperatures below the average, while red columns are above."
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <DataLoader />
          )}
        </>
      ) : (
        <div className={styles.message}>{i18n.t("No geometry found")}</div>
      )}
    </div>
  );
};

OrgUnit.propTypes = {
  orgUnit: PropTypes.object.isRequired,
};

export default OrgUnit;
