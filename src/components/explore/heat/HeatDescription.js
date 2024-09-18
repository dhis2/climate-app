import i18n from "@dhis2/d2-i18n";

const HeatDescription = () => (
  <p>
    {i18n.t(
      "The Universal Thermal Climate Index (UTCI) is an index that combines the effects of air temperature, humidity, wind speed, and radiation on the human body. It is a measure of the thermal stress experienced by a person in a given environment."
    )}
  </p>
);

export default HeatDescription;
