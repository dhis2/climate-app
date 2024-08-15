import PropTypes from "prop-types";
import PrecipitationMonthly from "./PrecipitationMonthly";
import PrecipitationDaily from "./PrecipitationDaily";

const PrecipitatioTab = ({
  orgUnit,
  periodType,
  dailyPeriod,
  monthlyPeriod,
  referencePeriod,
}) => (
  <>
    {periodType === "monthly" ? (
      <PrecipitationMonthly
        orgUnit={orgUnit}
        period={monthlyPeriod}
        referencePeriod={referencePeriod}
      />
    ) : (
      <PrecipitationDaily orgUnit={orgUnit} period={dailyPeriod} />
    )}
  </>
);

PrecipitatioTab.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  periodType: PropTypes.string.isRequired,
  dailyPeriod: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default PrecipitatioTab;
