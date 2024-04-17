import { useState } from "react";
import PropTypes from "prop-types";
import MonthSelect from "./MonthSelect";
import Chart from "./Chart";
import DataLoader from "../shared/DataLoader";
import getChartConfig from "./charts/temperatureProjection";
import useClimateProjections from "../../hooks/useClimateProjections";
import styles from "./styles/ClimateChangeTab.module.css";

const ProjectionsTab = ({ name, geometry }) => {
  const { data, loading } = useClimateProjections(geometry);

  if (loading) {
    return <DataLoader height={400} />;
  }

  return (
    <div>
      <Chart config={getChartConfig(name, data)} />
    </div>
  );
};

ProjectionsTab.propTypes = {
  name: PropTypes.string.isRequired,
  geometry: PropTypes.object.isRequired,
};

export default ProjectionsTab;
