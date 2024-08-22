import PropTypes from "prop-types";
import TemperatureMonthly from "./TemperatureMonthly";
import TemperatureDaily from "./TemperatureDaily";
import { MONTHLY } from "../../../utils/time";

const Temperature = ({
  orgUnit,
  periodType,
  dailyPeriod,
  monthlyPeriod,
  referencePeriod,
}) => (
  <>
    {periodType === MONTHLY ? (
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

Temperature.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  periodType: PropTypes.string.isRequired,
  dailyPeriod: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default Temperature;
