import {
  Outlet,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import PeriodTypeSelect from "./PeriodTypeSelect";
import MonthlyPeriodSelect from "./MonthlyPeriodSelect";
import ReferencePeriod from "./ReferencePeriodSelect";
import explorePeriodStore from "../../utils/explorePeriodStore";
import TemperatureMonthly from "./temperature/TemperatureMonthly";

const PeriodRoute = () => {
  const orgUnit = useOutletContext();
  const { pathname } = useLocation();
  const { startTime, endTime, referencePeriodId } = useParams();
  const { monthlyPeriod, referencePeriod } = explorePeriodStore();

  const variable = pathname.split("/")[3]; // TODO: Better way to get tab?
  const periodType = pathname.split("/")[4]; // TODO: Better way to get periodType?

  /*
  console.log(
    "PeriodRoute",
    orgUnit.id,
    variable,
    periodType,
    startTime,
    endTime,
    referencePeriod,
    referencePeriodId,
    monthlyPeriod
  );
  */

  return (
    <>
      <PeriodTypeSelect
        type={periodType.toUpperCase()}
        onChange={console.log}
      />
      <Outlet context={orgUnit} />
      <TemperatureMonthly
        orgUnit={orgUnit}
        period={monthlyPeriod}
        referencePeriod={referencePeriod}
      />
      <MonthlyPeriodSelect />
      <ReferencePeriod />
    </>
  );
};

export default PeriodRoute;
