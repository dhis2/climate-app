import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import AirQoPlugin from "./airqo/AirQoPlugin";
import styles from "./styles/StationPage.module.css";

const StationPage = () => {
  return <AirQoPlugin siteId="6461df90dab86000293ba49f" />;
};

export default StationPage;
