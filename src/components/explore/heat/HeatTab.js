import PropTypes from "prop-types";
import HeatDaily from "./HeatDaily";
import HeatMonthly from "./HeatMonthly";
import { MONTHLY } from "../../../utils/time";

const HeatTab = ({
  orgUnit,
  periodType,
  dailyPeriod,
  monthlyPeriod,
  referencePeriod,
}) => (
  <>
    {periodType === MONTHLY ? (
      <HeatMonthly
        orgUnit={orgUnit}
        period={monthlyPeriod}
        referencePeriod={referencePeriod}
      />
    ) : (
      <HeatDaily orgUnit={orgUnit} period={dailyPeriod} />
    )}
  </>
);

HeatTab.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  periodType: PropTypes.string.isRequired,
  dailyPeriod: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default HeatTab;
