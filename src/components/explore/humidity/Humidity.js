import PropTypes from "prop-types";
import HumidityMonthly from "./HumidityMonthly";
import HumidityDaily from "./HumidityDaily";
import { MONTHLY } from "../../../utils/time";

const Humidity = ({
  orgUnit,
  periodType,
  dailyPeriod,
  monthlyPeriod,
  referencePeriod,
}) => (
  <>
    {periodType === MONTHLY ? (
      <HumidityMonthly
        orgUnit={orgUnit}
        period={monthlyPeriod}
        referencePeriod={referencePeriod}
      />
    ) : (
      <HumidityDaily orgUnit={orgUnit} period={dailyPeriod} />
    )}
  </>
);

Humidity.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  periodType: PropTypes.string.isRequired,
  dailyPeriod: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default Humidity;
