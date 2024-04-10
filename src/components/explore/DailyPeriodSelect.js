import { useState } from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import DatePicker from "../shared/DatePicker";
import PeriodWarning from "../shared/PeriodWarning";
import { getNumberOfDays } from "../../utils/time";
import styles from "./styles/Period.module.css";

const maxDays = 1000;

const DailyPeriodSelect = ({ currentPeriod, onUpdate }) => {
  const [period, setPeriod] = useState(currentPeriod);
  const { startDate, endDate } = period;
  const days = getNumberOfDays(startDate, endDate);

  return (
    <div className={styles.container}>
      <div className={styles.pickers}>
        <DatePicker
          label={i18n.t("Start date")}
          defaultVal={startDate}
          onChange={(startDate) => setPeriod({ ...period, startDate })}
        />
        <DatePicker
          label={i18n.t("End date")}
          defaultVal={endDate}
          onChange={(endDate) => setPeriod({ ...period, endDate })}
        />
        <Button disabled={days > maxDays} onClick={() => onUpdate(period)}>
          Update
        </Button>
      </div>
      {days > maxDays && (
        <div className={styles.warning}>
          {i18n.t("Maximum {{maxDays}} days allowed", { maxDays })}
        </div>
      )}
      <PeriodWarning period={period} />
    </div>
  );
};

DailyPeriodSelect.propTypes = {
  currentPeriod: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default DailyPeriodSelect;
