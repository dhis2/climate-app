import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { CalendarInput } from "@dhis2/ui";
import TimeZone from "../shared/TimeZone";
import styles from "./styles/Period.module.css";

const Period = ({ period, onChange }) => {
  const { calendar, startDate, endDate, timeZone } = period;

  const onStartDateChange = (selectedDate) =>
    onChange({ ...period, startDate: selectedDate?.calendarDateString });

  const onEndDateChange = (selectedDate) =>
    onChange({ ...period, endDate: selectedDate?.calendarDateString });

  return (
    <div className={styles.container}>
      <h2>{i18n.t("Period")}</h2>
      <p>
        {i18n.t("Daily values will be imported between start and end dates")}
      </p>
      <div className={styles.pickers}>
        <CalendarInput
          onDateSelect={onStartDateChange}
          date={startDate}
          calendar={calendar}
          timeZone={timeZone}
          label={i18n.t("Start date")}
        />
        <CalendarInput
          onDateSelect={onEndDateChange}
          date={endDate}
          calendar={calendar}
          timeZone={timeZone}
          label={i18n.t("End date")}
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
