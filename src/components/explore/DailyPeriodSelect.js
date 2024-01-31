import { useState } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import DatePicker from "../shared/DatePicker";
import classes from "./styles/Period.module.css";

const DailyPeriodSelect = ({ currentPeriod, onUpdate }) => {
  const [period, setPeriod] = useState(currentPeriod);
  const { startDate, endDate } = period;

  return (
    <div className={classes.pickers}>
      <DatePicker
        label={i18n.t("Start date")}
        defaultVal={startDate}
        onBlur={(startDate) => setPeriod({ ...period, startDate })}
      />
      <DatePicker
        label={i18n.t("End date")}
        defaultVal={endDate}
        onBlur={(endDate) => setPeriod({ ...period, endDate })}
      />
      <Button onClick={() => onUpdate(period)}>Update</Button>
    </div>
  );
};

DailyPeriodSelect.propTypes = {
  currentPeriod: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default DailyPeriodSelect;
