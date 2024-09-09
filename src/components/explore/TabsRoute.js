import { useEffect } from "react";
import { TabBar, Tab } from "@dhis2/ui";
import {
  Outlet,
  useOutletContext,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PeriodTypeSelect from "./PeriodTypeSelect";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import DailyPeriodSelect from "./DailyPeriodSelect";
import ReferencePeriod from "./ReferencePeriodSelect";
import exploreStore from "../../utils/exploreStore";
import useExploreUri, {
  hasMonthlyAndDailyData,
} from "../../hooks/useExploreUri";
import { MONTHLY } from "../../utils/time";
import styles from "./styles/OrgUnit.module.css";

const tabs = [
  { id: "forecast10days", label: "10 days forecast", pointOnly: true },
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
  { id: "humidity", label: "Humidity" },
  { id: "climatechange", label: "Climate change" },
];

const createUri = ({
  orgUnitId,
  tab,
  periodType = MONTHLY,
  monthlyPeriod,
  dailyPeriod,
  referencePeriod,
}) => {
  const baseUri = `/explore/${orgUnitId}/${tab}`;

  if (periodType === MONTHLY) {
    return `${baseUri}/monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}/${referencePeriod.id}`;
  } else {
    return `${baseUri}/daily/${dailyPeriod.startTime}/${dailyPeriod.endTime}`;
  }
};

const Tabs = () => {
  const { pathname } = useLocation();
  const orgUnit = useOutletContext();
  const navigate = useNavigate();

  const { tab, setTab, periodType } = exploreStore();

  const uri = useExploreUri();
  const isPoint = orgUnit.geometry.type === "Point";
  const hasPeriodType = hasMonthlyAndDailyData.includes(tab);

  useEffect(() => {
    if (uri && uri !== pathname) {
      navigate(uri);
    }
  }, [pathname, uri, navigate]);

  return (
    <>
      <TabBar fixed>
        {tabs
          .filter((t) => !t.pointOnly || t.pointOnly === isPoint)
          .map(({ id, label }) => (
            <Tab key={id} selected={tab === id} onClick={() => setTab(id)}>
              {label}
            </Tab>
          ))}
      </TabBar>
      <div className={styles.tabContent}>
        {hasPeriodType && <PeriodTypeSelect />}
        <Outlet context={orgUnit} />
        {hasPeriodType && (
          <>
            {periodType === MONTHLY ? (
              <>
                <MonthlyPeriodSelect />
                <ReferencePeriod />
              </>
            ) : (
              <DailyPeriodSelect />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Tabs;
