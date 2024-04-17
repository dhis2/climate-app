import { useState } from "react";
import PropTypes from "prop-types";
import MonthSelect from "./MonthSelect";
import Chart from "./Chart";
import DataLoader from "../shared/DataLoader";
import getChartConfig from "./charts/temperatureAnomaly";
import styles from "./styles/ClimateChangeTab.module.css";

const ProjectionsTab = ({ name, monthlyData, referencePeriod }) => {
  return <div>Climate projections</div>;
};

ProjectionsTab.propTypes = {
  name: PropTypes.string.isRequired,
  monthlyData: PropTypes.array.isRequired,
  referencePeriod: PropTypes.string.isRequired,
};

export default ProjectionsTab;
