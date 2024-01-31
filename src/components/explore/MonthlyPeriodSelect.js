import { useState } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import MonthPicker from "../shared/MonthPicker";
import classes from "./styles/Period.module.css";

const MonthlyPeriodSelect = ({ currentPeriod, onUpdate }) => {
  const [period, setPeriod] = useState(currentPeriod);
  const { startMonth, endMonth } = period;

  return (
    <div className={classes.pickers}>
      <MonthPicker
        label={i18n.t("Start month")}
        defaultVal={startMonth}
        onBlur={(startMonth) => setPeriod({ ...period, startMonth })}
      />
      <MonthPicker
        label={i18n.t("End month")}
        defaultVal={endMonth}
        onBlur={(endMonth) => setPeriod({ ...period, endMonth })}
      />
      <Button onClick={() => onUpdate(period)}>Update</Button>
    </div>
  );
};

MonthlyPeriodSelect.propTypes = {
  currentPeriod: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MonthlyPeriodSelect;
