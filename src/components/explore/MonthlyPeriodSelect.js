import { useState } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import MonthPicker from "../shared/MonthPicker";
import { getNumberOfMonths } from "../../utils/time";
import styles from "./styles/Period.module.css";

const maxMonths = 60;

const MonthlyPeriodSelect = ({ currentPeriod, onUpdate }) => {
  const [period, setPeriod] = useState(currentPeriod);
  const { startMonth, endMonth } = period;
  const months = getNumberOfMonths(startMonth, endMonth);

  return (
    <div className={styles.container}>
      <div className={styles.pickers}>
        <MonthPicker
          label={i18n.t("Start month")}
          defaultVal={startMonth}
          onChange={(startMonth) => setPeriod({ ...period, startMonth })}
        />
        <MonthPicker
          label={i18n.t("End month")}
          defaultVal={endMonth}
          onChange={(endMonth) => setPeriod({ ...period, endMonth })}
        />
        <Button disabled={months > maxMonths} onClick={() => onUpdate(period)}>
          Update
        </Button>
      </div>
      {months > maxMonths && (
        <div className={styles.warning}>
          {i18n.t("Maximum {{maxMonths}} months allowed", { maxMonths })}
        </div>
      )}
    </div>
  );
};

MonthlyPeriodSelect.propTypes = {
  currentPeriod: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MonthlyPeriodSelect;
