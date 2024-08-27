import { useEffect, useCallback } from "react";
import { TabBar, Tab } from "@dhis2/ui";
import {
  Outlet,
  useOutletContext,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import PeriodTypeSelect from "./PeriodTypeSelect";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import DailyPeriodSelect from "./DailyPeriodSelect";
import ReferencePeriod from "./ReferencePeriodSelect";
import explorePeriodStore from "../../utils/explorePeriodStore";
import { MONTHLY } from "../../utils/time";
import styles from "./styles/OrgUnit.module.css";

const tabs = [
  { id: "forecast10days", label: "10 days forecast", pointOnly: true },
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
  { id: "humidity", label: "Humidity" },
  { id: "climatechange", label: "Climate change" },
];

const hasMonthlyAndDailyData = ["temperature", "precipitation", "humidity"];

const Tabs = () => {
  const orgUnit = useOutletContext();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { monthlyPeriod, dailyPeriod, referencePeriod, setMonthlyPeriod } =
    explorePeriodStore();

  const orgUnitId = orgUnit.id;
  const isPoint = orgUnit.geometry.type === "Point";

  const tab = location.pathname.split("/")[3]; // TODO: Better way to get tab?
  const periodType = location.pathname.split("/")[4]?.toUpperCase(); // TODO: Better way to get periodType?

  const baseUri = `/explore/${orgUnitId}/${tab}`;
  const monthlyPeriodUri = `${baseUri}/monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}/${referencePeriod.id}`;
  const dailyPeriodUri = `${baseUri}/daily/${dailyPeriod.startTime}/${dailyPeriod.endTime}`;

  const onPeriodTypeChange = useCallback(
    (type) => {
      navigate(type === MONTHLY ? monthlyPeriodUri : dailyPeriodUri);
    },
    [monthlyPeriodUri, dailyPeriodUri, navigate]
  );

  const onMonthlyPeriodChange = useCallback(
    (period) =>
      navigate(
        `${baseUri}/monthly/${period.startTime}/${period.endTime}/${referencePeriod.id}`
      ),
    [baseUri, referencePeriod, navigate]
  );

  // Default to monthly period type
  useEffect(() => {
    if (!periodType) {
      navigate(monthlyPeriodUri);
    }
  }, [monthlyPeriodUri, navigate]);

  useEffect(() => {
    if (
      periodType === MONTHLY &&
      (params.startTime !== monthlyPeriod.startTime ||
        params.endTime !== monthlyPeriod.endTime)
    ) {
      setMonthlyPeriod({
        startTime: params.startTime,
        endTime: params.endTime,
      });
    }
  }, [periodType, params, monthlyPeriod, setMonthlyPeriod]);

  return (
    <>
      <TabBar fixed>
        {tabs
          .filter((t) => !t.pointOnly || t.pointOnly === isPoint)
          .map(({ id, label }) => (
            <Tab
              key={id}
              selected={tab === id}
              onClick={() => navigate(`/explore/${orgUnitId}/${id}`)}
            >
              {label}
            </Tab>
          ))}
      </TabBar>
      <div className={styles.tabContent}>
        {periodType && (
          <PeriodTypeSelect type={periodType} onChange={onPeriodTypeChange} />
        )}
        <Outlet context={orgUnit} />
        {hasMonthlyAndDailyData.includes(tab) && (
          <>
            {periodType === MONTHLY ? (
              <>
                <MonthlyPeriodSelect onChange={onMonthlyPeriodChange} />
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
