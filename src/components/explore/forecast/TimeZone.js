import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import useSystemInfo from "../../../hooks/useSystemInfo";
import styles from "./styles/TimeZone.module.css";

const TimeZone = ({ value, browserTimeZone, onChange }) => {
  const { system } = useSystemInfo();

  const serverTimeZone = system?.systemInfo?.serverTimeZoneId;

  if (!serverTimeZone || serverTimeZone === browserTimeZone) {
    return null;
  }

  return (
    <div className={styles.timeZone}>
      <SingleSelectField
        label={i18n.t("Time zone")}
        selected={value}
        onChange={({ selected }) => onChange(selected)}
      >
        <SingleSelectOption value={serverTimeZone} label={serverTimeZone} />
        <SingleSelectOption value={browserTimeZone} label={browserTimeZone} />
      </SingleSelectField>
    </div>
  );
};

export default TimeZone;
