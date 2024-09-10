import { useState, useMemo, useEffect } from "react";
import {
  useNavigationType,
  useLocation,
  useParams,
  useOutletContext,
} from "react-router-dom";
import exploreStore from "../utils/exploreStore";
import { referencePeriods } from "../components/explore/ReferencePeriodSelect";
import { MONTHLY } from "../utils/time";

const hasMonthlyAndDailyData = ["temperature", "precipitation", "humidity"];

// Returns syncronized (uri/store) explore params
const useExploreUri = () => {
  const [isPop, setIsPop] = useState(false);
  const navigationType = useNavigationType();
  const { pathname } = useLocation();
  const params = useParams();
  const orgUnit = useOutletContext();
  const store = exploreStore();

  const uri = useMemo(() => {
    if (!isPop) {
      const {
        tab,
        periodType,
        monthlyPeriod,
        dailyPeriod,
        referencePeriod,
        month,
      } = store;

      if (!tab) {
        return null;
      }

      const baseUri = `/explore/${orgUnit.id}/${tab}`;
      let uri;

      if (tab === "forecast10days") {
        uri = baseUri;
      } else if (tab === "climatechange" && month && referencePeriod) {
        uri = `${baseUri}/${month}/${referencePeriod.id}`;
      } else if (hasMonthlyAndDailyData.includes(tab)) {
        if (periodType === MONTHLY && monthlyPeriod && referencePeriod) {
          uri = `${baseUri}/monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}/${referencePeriod.id}`;
        } else if (dailyPeriod) {
          uri = `${baseUri}/daily/${dailyPeriod.startTime}/${dailyPeriod.endTime}`;
        }
      }

      return uri;
    }

    return null;
  }, [store, orgUnit, isPop]);

  useEffect(() => {
    setIsPop(navigationType === "POP");
  }, [navigationType]);

  useEffect(() => {
    // TODO: Better way to get tab and periodType?
    const tab = pathname.split("/")[3];

    if (isPop) {
      store.setTab(tab);

      const { month, startTime, endTime, referencePeriodId } = params;

      if (tab === "climatechange") {
        store.setMonth(month);
      } else if (hasMonthlyAndDailyData.includes(tab)) {
        const periodType = pathname.split("/")[4]?.toUpperCase() || MONTHLY;
        store.setPeriodType(periodType);

        if (periodType === MONTHLY) {
          store.setMonthlyPeriod({ startTime, endTime });
        } else if (periodType === "DAILY") {
          store.setDailyPeriod({ startTime, endTime });
        }
      }

      if (referencePeriodId) {
        store.setReferencePeriod(
          referencePeriods.find((p) => p.id === referencePeriodId)
        );
      }
    }

    return () => {
      setIsPop(false);
    };
  }, [store, isPop, pathname, params]);

  return uri;
};

export default useExploreUri;
