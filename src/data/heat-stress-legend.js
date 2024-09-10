import i18n from "@dhis2/d2-i18n";

const opacity = 0.4;

export default {
  name: i18n.t("Heat/cold stress"),
  items: [
    {
      name: i18n.t("Extreme cold stress"),
      label: i18n.t("Extreme<br>cold stress"),
      color: `rgba(10,48,107,${opacity})`,
      hexColor: "#0A306B",
      from: -60,
      to: -40,
    },
    {
      name: i18n.t("Very strong cold stress"),
      label: i18n.t("Very strong<br>cold stress"),
      color: `rgba(10,82,156,${opacity})`,
      hexColor: "#0A529C",
      from: -40,
      to: -27,
    },
    {
      name: i18n.t("Strong cold stress"),
      label: i18n.t("Strong<br>cold stress"),
      color: `rgba(35,112,181,${opacity})`,
      hexColor: "#2370B5",
      from: -27,
      to: -13,
    },
    {
      name: i18n.t("Moderate cold stress"),
      label: i18n.t("Moderate<br>cold stress"),
      color: `rgba(65,146,197,${opacity})`,
      hexColor: "#4192C5",
      from: -13,
      to: 0,
    },
    {
      name: i18n.t("Slight cold stress"),
      label: i18n.t("Slight<br>cold stress"),
      color: `rgba(158,203,224,${opacity})`,
      hexColor: "#9ECBE0",
      from: 0,
      to: 9,
    },
    {
      name: i18n.t("No thermal stress"),
      label: i18n.t("No thermal<br>stress"),
      color: `rgba(216,240,162,${opacity})`,
      hexColor: "#D8F0A2",
      from: 9,
      to: 26,
    },
    {
      name: i18n.t("Moderate heat stress"),
      label: i18n.t("Moderate<br>heat stress"),
      color: `rgba(255,140,0,${opacity - 0.1})`,
      hexColor: "#FF8C00",
      from: 26,
      to: 32,
    },
    {
      name: i18n.t("Strong heat stress"),
      label: i18n.t("Strong<br>heat stress"),
      color: `rgba(255,70,2,${opacity})`,
      hexColor: "#FF4602",
      from: 32,
      to: 38,
    },
    {
      name: i18n.t("Very strong heat stress"),
      label: i18n.t("Very strong<br>heat stress"),
      color: `rgba(206,1,2,${opacity})`,
      hexColor: "#CE0102",
      from: 38,
      to: 46,
    },
    {
      name: i18n.t("Extreme heat stress"),
      label: i18n.t("Extreme<br>heat stress"),
      color: `rgba(139,1,2,${opacity})`,
      hexColor: "#8B0102",
      from: 46,
      to: 60,
    },
  ],
};
