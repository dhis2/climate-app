import i18n from "@dhis2/d2-i18n";
import { SegmentedControl } from "@dhis2/ui";
import PropTypes from "prop-types";
import styles from "./styles/PeriodTypeSelect.module.css";

export const MONTHLY = "monthly";
export const DAILY = "daily";

const PeriodTypeSelect = ({ type, onChange }) => (
  <div className={styles.periodTypeButtons}>
    <SegmentedControl
      ariaLabel="Monthly or daily"
      onChange={({ value }) => onChange(value)}
      options={[
        {
          label: i18n.t("Monthly"),
          value: MONTHLY,
        },
        {
          label: i18n.t("Daily"),
          value: DAILY,
        },
      ]}
      selected={type}
    />
  </div>
);

PeriodTypeSelect.propTypes = {
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PeriodTypeSelect;
