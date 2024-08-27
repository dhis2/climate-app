import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import { useParams } from "react-router-dom";
import DatePicker from "../shared/DatePicker";
import { getNumberOfDays } from "../../utils/time";
import explorePeriodStore from "../../utils/explorePeriodStore";
import styles from "./styles/Period.module.css";

const maxDays = 1000;

const DailyPeriodSelect = () => {
  const { dailyPeriod, setDailyPeriod } = explorePeriodStore();
  const [period, setPeriod] = useState(dailyPeriod);
  const params = useParams();

  const { startTime, endTime } = period;
  const days = getNumberOfDays(startTime, endTime);

  useEffect(() => {
    const { startTime, endTime } = params;

    if (startTime !== period.startTime || endTime !== period.endTime) {
      setDailyPeriod({ startTime, endTime });
      setPeriod({ startTime, endTime });
    }
  }, [params, period]);

  return (
    <div className={styles.container}>
      <div className={styles.pickers}>
        <DatePicker
          label={i18n.t("Start date")}
          defaultVal={startTime}
          onChange={(startTime) => setPeriod({ ...period, startTime })}
        />
        <DatePicker
          label={i18n.t("End date")}
          defaultVal={endTime}
          onChange={(endTime) => setPeriod({ ...period, endTime })}
        />
        <Button
          disabled={days > maxDays}
          onClick={() => setDailyPeriod(period)}
        >
          Update
        </Button>
      </div>
      {days > maxDays && (
        <div className={styles.warning}>
          {i18n.t("Maximum {{maxDays}} days allowed", { maxDays })}
        </div>
      )}
    </div>
  );
};

export default DailyPeriodSelect;
