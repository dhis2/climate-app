import PropTypes from "prop-types";
import TemperatureMonthly from "./TemperatureMonthly";
import TemperatureDaily from "./TemperatureDaily";

const TemperatureTab = ({
  orgUnit,
  periodType,
  dailyPeriod,
  monthlyPeriod,
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
  dailyPeriod: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default TemperatureTab;