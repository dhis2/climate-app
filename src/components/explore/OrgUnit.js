import { useState } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import OrgUnitType from "./OrgUnitType";
import PeriodTypeSelect from "./PeriodTypeSelect";
import DailyPeriodSelect from "./DailyPeriodSelect";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import ReferencePeriodSelect, {
  defaultReferencePeriod,
} from "./ReferencePeriodSelect";
import Tabs from "./Tabs";
import ForecastTab from "./forecast/ForecastTab";
import TemperatureTab from "./temperature/TemperatureTab";
import PrecipitationTab from "./precipitation/PrecipitationTab";
import HumidityTab from "./humidity/HumidityTab";
import ClimateChangeTab from "./climateChange/ClimateChangeTab";
import { getDefaultMonthlyPeriod } from "../../utils/time";
import { DAILY, MONTHLY, getDefaultExplorePeriod } from "../../utils/time";
import styles from "./styles/OrgUnit.module.css";

const tabs = {
  forecast10days: ForecastTab,
  temperature: TemperatureTab,
  precipitation: PrecipitationTab,
  humidity: HumidityTab,
  climatechange: ClimateChangeTab,
};

const OrgUnit = ({ orgUnit }) => {
  const isPoint = orgUnit.geometry?.type === "Point";
  const [tab, setTab] = useState(isPoint ? "forecast10days" : "temperature");
  const [dailyPeriod, setDailyPeriod] = useState(getDefaultExplorePeriod());
  const [monthlyPeriod, setMonthlyPeriod] = useState(getDefaultMonthlyPeriod());
  const [referencePeriod, setReferencePeriod] = useState(
    defaultReferencePeriod
  );
  const [periodType, setPeriodType] = useState(MONTHLY);

  const Tab = tabs[tab];

  const hasMonthlyAndDailyData =
    tab !== "forecast10days" && tab !== "climatechange";

  return (
    <div className={styles.orgUnit}>
      <h1>
        {orgUnit.properties.name} <OrgUnitType type={orgUnit.geometry?.type} />
      </h1>
      {orgUnit.geometry ? (
        <>
          {hasMonthlyAndDailyData && (
            <PeriodTypeSelect type={periodType} onChange={setPeriodType} />
          )}
          <Tabs selected={tab} isPoint={isPoint} onChange={setTab} />
          <div className={styles.tabContent}>
            <Tab
              name={orgUnit.properties.name}
              orgUnit={orgUnit}
              periodType={periodType}
              monthlyPeriod={monthlyPeriod}
              dailyPeriod={dailyPeriod}
              referencePeriod={referencePeriod}
            />
            {hasMonthlyAndDailyData && (
              <>
                {periodType === DAILY ? (
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
            {(tab === "climatechange" ||
              (periodType === "monthly" && tab !== "forecast10days")) && (
              <ReferencePeriodSelect
                selected={referencePeriod.id}
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
        <div className={styles.message}>{i18n.t("No geometry found")}</div>
      )}
    </div>
  );
};

OrgUnit.propTypes = {
  orgUnit: PropTypes.object.isRequired,
};

export default OrgUnit;
