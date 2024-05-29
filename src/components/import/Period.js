import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { CalendarInput } from "@dhis2/ui";
import TimeZone from "../shared/TimeZone";
import styles from "./styles/Period.module.css";

const Period = ({ calendar, period, onChange }) => {
  const handleStartDateChange = (selectedDate) => {
    period.startDate = selectedDate?.calendarDateString;
    onChange({ ...period, selectedDate });
  };

  const handleEndDateChange = (selectedDate) => {
    period.endDate = selectedDate?.calendarDateString;
    onChange({ ...period, selectedDate });
  };

  return (
    <div className={styles.container}>
      <h2>{i18n.t("Period")}</h2>
      <p>
        {i18n.t("Daily values will be imported between start and end dates")}
      </p>
      <div className={styles.pickers}>
        <CalendarInput
          onDateSelect={handleStartDateChange}
          date={period.startDate}
          calendar={calendar}
          label={i18n.t("Start date")}
        />

        <CalendarInput
          onDateSelect={handleEndDateChange}
          date={period.endDate}
          calendar={calendar}
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
