import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { CalendarInput } from "@dhis2/ui";
import TimeZone from "../shared/TimeZone";
import styles from "./styles/Period.module.css";

const Period = ({ calendar, period, onChange }) => {
  const { startTime, endTime } = period;

  return (
    <div className={styles.container}>
      <h2>{i18n.t("Period")}</h2>
      <p>
        {i18n.t("Daily values will be imported between start and end dates")}
      </p>
      <div className={styles.pickers}>
        <CalendarInput
          label={i18n.t("Start date")}
          date={startTime}
          calendar={calendar}
          defaultVal={startTime}
          onDateSelect={({ calendarDateString }) =>
            onChange({ ...period, startTime: calendarDateString })
          }
        />
        <CalendarInput
          label={i18n.t("End date")}
          date={period.endTime}
          calendar={calendar}
          defaultVal={endTime}
          onDateSelect={({ calendarDateString }) =>
            onChange({ ...period, endTime: calendarDateString })
          }
        />
        <TimeZone period={period} onChange={onChange} />
      </div>
    </div>
  );
};

Period.propTypes = {
  period: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default Period;
