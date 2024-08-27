import PropTypes from "prop-types";
import { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import { useParams } from "react-router-dom";
import MonthPicker from "../shared/MonthPicker";
import { getNumberOfMonths } from "../../utils/time";
import styles from "./styles/Period.module.css";

const maxMonths = 60;

const MonthlyPeriodSelect = ({ onChange }) => {
  const params = useParams();
  const { startTime, endTime } = params;
  const [period, setPeriod] = useState({ startTime, endTime });
  const months = getNumberOfMonths(startTime, endTime);

  return (
    <div className={styles.container}>
      <div className={styles.pickers}>
        <MonthPicker
          label={i18n.t("Start month")}
          defaultVal={startTime}
          onChange={(startTime) => setPeriod({ ...period, startTime })}
        />
        <MonthPicker
          label={i18n.t("End month")}
          defaultVal={endTime}
          onChange={(endTime) => setPeriod({ ...period, endTime })}
        />
        <Button disabled={months > maxMonths} onClick={() => onChange(period)}>
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
  onChange: PropTypes.func.isRequired,
};

export default MonthlyPeriodSelect;
