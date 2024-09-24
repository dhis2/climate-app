import i18n from "@dhis2/d2-i18n";
import { InputField } from "@dhis2/ui";
import NumberInput from "./NumberInput";
import HeatCategory from "./HeatCategory";
import useAppSettings from "../../hooks/useAppSettings";

const ChartSettings = () => {
  const { settings, changeSetting } = useAppSettings();
  const {
    tempMin,
    tempMax,
    tempChange,
    heatMin,
    heatMax,
    precipMonthlyMax,
    precipDailyMax,
  } = settings;

  return (
    <>
      <h2>Chart settings</h2>
      <NumberInput
        id="tempMax"
        label={i18n.t("Max temperature")}
        value={tempMax}
        onChange={changeSetting}
        inputWidth="100px"
      />
      <NumberInput
        id="tempMin"
        label={i18n.t("Min temperature")}
        value={tempMin}
        onChange={changeSetting}
        validationText={
          tempMin !== undefined && tempMax !== undefined && tempMin >= tempMax
            ? i18n.t("Min temperature must be less than max temperature")
            : undefined
        }
      />
      <NumberInput
        id="tempChange"
        label={i18n.t("Max change in temperature (+/-)")}
        value={tempChange}
        onChange={changeSetting}
      />
      <NumberInput
        id="precipMonthlyMax"
        label={i18n.t("Max monthly precipitation")}
        value={precipMonthlyMax}
        onChange={changeSetting}
      />
      <NumberInput
        id="precipDailyMax"
        label={i18n.t("Max daily precipitation")}
        value={precipDailyMax}
        onChange={changeSetting}
      />
      <HeatCategory
        id="heatMax"
        label={i18n.t("Heat stress upper category")}
        value={heatMax}
        onChange={changeSetting}
      />
      <HeatCategory
        id="heatMin"
        label={i18n.t("Heat stress lower category")}
        value={heatMin}
        onChange={changeSetting}
      />
    </>
  );
};

export default ChartSettings;
