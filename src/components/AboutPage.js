import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import useEarthEngineToken from "../hooks/useEarthEngineToken";
import styles from "./styles/AboutPage.module.css";

// TODO: How to combine links and i18n.t?
const AboutPage = () => {
  const [hasToken, setHasToken] = useState();
  const tokenPromise = useEarthEngineToken();

  useEffect(() => {
    tokenPromise
      .then((token) => setHasToken(!!token))
      .catch(() => setHasToken(false));
  }, [tokenPromise]);

  return (
    <div className={styles.container}>
      <h1>{i18n.t("About this app")}</h1>
      {hasToken !== true && (
        <p>
          {i18n.t("You need access to Google Earth Engine to use this app.")}{" "}
          <a href="https://docs.dhis2.org/en/topics/tutorials/google-earth-engine-sign-up.html">
            {i18n.t("How to get access?")}
          </a>
        </p>
      )}
      <p>
        {i18n.t(
          "This app is part of the ongoing “DHIS2 for Climate“ project. It will get frequent updates, so please make sure you have the latest version from the DHIS2 App Hub. The app is developed by the University of Oslo, but it is not a DHIS2 core app. Useful parts of this app might be incorporated into the DHIS2 core in the future, based on your feedback."
        )}
      </p>
      <p>
        {i18n.t(
          "The app allows you to explore and import temperature and precipitation data in DHIS2. The data source is “ERA5-Land“, which is considered the most accurate and complete global climate dataset available. The video below shows you how this dataset was created by combining weather observations with a weather model (climate reanalysis)."
        )}
      </p>
      <iframe
        src="https://www.youtube-nocookie.com/embed/FAGobvUGl24?si=nBJeVx1_BPM4X5vF&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <p>
        <a
          href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land"
          target="_blank"
        >
          {i18n.t("Read about ERA5-Land on Copernicus Climate Data Store")}
        </a>
      </p>
      <p>
        {i18n.t(
          "If you just want to look at weather and climate data for your organisation units, click on “Explore data” in the left menu. No configuration is needed."
        )}
      </p>
      <p>
        {i18n.t(
          "We recommend importing data into DHIS2 data elements. This will allow you to combine weather and climate data with your health data across all DHIS2 analytics apps. You need to configure your DHIS2 instance before you can import data. See our guide by clicking on “Setup guide”."
        )}
      </p>
      <p>
        {i18n.t(
          "After the configuration is done, you can import temperature and precipitation data under “Import data”."
        )}
      </p>
      <p>
        After the data is imported, you should generate the analytics tables in
        the Data Administration app. This will allow you to see the data in the
        DHIS2 analytics apps.
      </p>
      <h2>{i18n.t("How the data is calculated")}</h2>
      <p>
        The data is calculated for your organsation units on Google Earth
        Engine. The resolution of the data is about 9 km. If you select a health
        facility we use the value where the facility is located. If you select a
        district we automatically aggregate the values within that district.
      </p>
    </div>
  );
};

export default AboutPage;
