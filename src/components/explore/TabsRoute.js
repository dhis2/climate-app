import { useEffect } from "react";
import { TabBar, Tab } from "@dhis2/ui";
import {
  Outlet,
  useOutletContext,
  useLocation,
  useParams,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import PeriodTypeSelect from "./PeriodTypeSelect";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import DailyPeriodSelect from "./DailyPeriodSelect";
import ReferencePeriod from "./ReferencePeriodSelect";
import exploreStore from "../../utils/exploreStore";
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
  const orgUnit = useOutletContext();
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const {
    tab,
    periodType,
    monthlyPeriod,
    dailyPeriod,
    referencePeriod,
    month,
    setTab,
    // setMonthlyPeriod,
  } = exploreStore();

  const orgUnitId = orgUnit.id;
  const isPoint = orgUnit.geometry.type === "Point";

  const hasPeriodType = hasMonthlyAndDailyData.includes(tab);

  // const tab = location.pathname.split("/")[3]; // TODO: Better way to get tab?
  // const periodType = location.pathname.split("/")[4]?.toUpperCase(); // TODO: Better way to get periodType?

  // Default to monthly period type
  /*
  useEffect(() => {
    if (!periodType) {
      console.log("C", monthlyPeriodUri);
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
  */

  // Default to monthly period type
  /*
  useEffect(() => {
    if (!periodType) {
      navigate(monthlyPeriodUri);
    }
  }, [monthlyPeriodUri, navigate]);
  */

  useEffect(() => {
    // console.log("Tabs", navigationType);

    // if (navigationType === "PUSH") {
    // Update uri from store
    const baseUri = `/explore/${orgUnitId}/${tab}`;
    let uri;

    if (tab === "forecast10days") {
      uri = baseUri;
    } else if (tab === "climatechange") {
      // console.log("month", month);
      uri = `${baseUri}/${month}/${referencePeriod.id}`;
    } else if (periodType === MONTHLY) {
      uri = `${baseUri}/monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}/${referencePeriod.id}`;
    } else {
      uri = `${baseUri}/daily/${dailyPeriod.startTime}/${dailyPeriod.endTime}`;
    }

    if (pathname !== uri) {
      console.log("navigate", uri);
      navigate(uri);
    }
    /*}  else if (navigationType === "POP") {
      // Update store from uri

      const uriTab = pathname.split("/")[3]; // TODO: Better way to get tab?
      // const uriPeriodType = pathname.split("/")[4]?.toUpperCase(); // TODO: Better way to get periodType?

      
      if (tab !== uriTab) {
        setTab(uriTab);
      }
      
      if (uriTab === "climatechange") {
        console.log("navigationType", params, month, referencePeriod);
      }
    }*/
  }, [
    pathname,
    navigationType,
    params,
    orgUnitId,
    tab,
    periodType,
    monthlyPeriod,
    dailyPeriod,
    referencePeriod,
    month,
    navigate,
  ]);

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
