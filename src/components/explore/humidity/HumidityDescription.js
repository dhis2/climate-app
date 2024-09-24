import i18n from "@dhis2/d2-i18n";

const HumidityDescription = () => (
  <p>
    {i18n.t(
      "Relative humidity is the the amount of water vapour present in air expressed as a percentage of the amount needed for saturation at the same temperature (dewpoint)."
    )}
  </p>
);

export default HumidityDescription;
