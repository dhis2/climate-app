import classes from "./styles/DataSource.module.css";

const DataSource = () => (
  <div className={classes.dataSource}>
    Data source:{" "}
    <a
      href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land"
      target="_blank"
    >
      ERA5-Land
    </a>{" "}
    /{" "}
    <a
      href="https://developers.google.com/earth-engine/datasets/tags/era5-land"
      target="_blank"
    >
      Google Earth Engine
    </a>
  </div>
);

export default DataSource;
