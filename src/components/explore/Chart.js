import PropTypes from "prop-types";
import Highcharts from "highcharts";
import accessibility from "highcharts/modules/accessibility";
import exporting from "highcharts/highcharts-more";
import highchartsMore from "highcharts/modules/exporting";
import React, { useRef, useLayoutEffect } from "react";

accessibility(Highcharts);
exporting(Highcharts);
highchartsMore(Highcharts);

const Chart = ({ config }) => {
  const chartRef = useRef();

  useLayoutEffect(() => {
    Highcharts.chart(chartRef.current, config);
  }, [config, chartRef]);

  return <div ref={chartRef} />;
};

Chart.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Chart;
