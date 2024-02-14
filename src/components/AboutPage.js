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
      {hasToken === false && (
        <p>
          {i18n.t("You need access to Google Earth Engine to use this app.")}{" "}
          <a href="https://docs.dhis2.org/en/topics/tutorials/google-earth-engine-sign-up.html">
            {i18n.t("Read how to get access here")}
          </a>
          .
        </p>
      )}
      <p>
        {i18n.t(`This app allows you to explore and import temperature and precipitation
        data into data elements of your DHIS2 instance. Values are automatically
        calculated for the organisation units you select. We import daily data that can 
        be aggregated to other periods in DHIS2.`)}
      </p>
      <p>
        The data source is{" "}
        <a
          href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land"
          target="_blank"
        >
          ERA5-Land from the Copernicus Climate Data Store
        </a>
        , which is considered the most accurate and complete global climate
        dataset available. The video below explains how this dataset is created
        and maintained.
      </p>
      <iframe
        src="https://www.youtube-nocookie.com/embed/FAGobvUGl24?si=nBJeVx1_BPM4X5vF&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <p>
        There might be more detailed temperature and precipitation data
        available for your country, but it might not be aligned with your
        organisation units or health periods.
      </p>
      <p>
        We encourage you to use the best climate and weather data available data
        for your country or region. This app can help you to get started and
        look for connections between climate and health data.
      </p>
      <p>
        You can either explore the data directly in this app, or through the
        DHIS2 analytics apps after importing. This will also allow you to
        combine climate and health data in the same visualizations and
        dashboards.
      </p>
      <h2>{i18n.t("How the data is calculated")}</h2>
      <p>
        The data is calculated for your organsation units on Google Earth
        Engine. The resolution of the data is about 9 km. If you select a health
        facility we use the value where the facility is located. If you select a
        district we automatically aggregate the values within that district.
      </p>
      <h2>{i18n.t("How to use the app")}</h2>
    </div>
  );
};

export default AboutPage;
