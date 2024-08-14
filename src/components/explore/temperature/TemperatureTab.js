import PropTypes from "prop-types";
import TemperatureMonthly from "./TemperatureMonthly";
import TemperatureDaily from "./TemperatureDaily";

const TemperatureTab = ({
  orgUnit,
  periodType,
  monthlyPeriod,
  dailyPeriod,
  referencePeriod,
}) => (
  <>
    {periodType === "monthly" ? (
      <TemperatureMonthly
        orgUnit={orgUnit}
        period={monthlyPeriod}
        referencePeriod={referencePeriod}
      />
    ) : (
      <TemperatureDaily orgUnit={orgUnit} period={dailyPeriod} />
    )}
  </>
);

TemperatureTab.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  periodType: PropTypes.string.isRequired,
  referencePeriod: PropTypes.string.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  dailyPeriod: PropTypes.object.isRequired,
};

export default TemperatureTab;
