import i18n from "@dhis2/d2-i18n";
import DatePicker from "../shared/DatePicker";
import TimeZone from "../shared/TimeZone";
import classes from "./styles/Period.module.css";

const Period = ({ period, onChange }) => {
  const { startDate, endDate } = period;

  return (
    <div>
      <h2>{i18n.t("Period")}</h2>
      <p>
        {i18n.t("Daily values will be imported between start and end dates")}
      </p>
      <div className={classes.pickers}>
        <DatePicker
          label={i18n.t("Start date")}
          defaultVal={startDate}
          onBlur={(startDate) => onChange({ ...period, startDate })}
        />
        <DatePicker
          label={i18n.t("End date")}
          defaultVal={endDate}
          onBlur={(endDate) => onChange({ ...period, endDate })}
        />
        <TimeZone period={period} onChange={onChange} />
      </div>
    </div>
  );
};

export default Period;
