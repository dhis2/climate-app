import PropTypes from "prop-types";
import Highcharts from "highcharts";
import accessibility from "highcharts/modules/accessibility";
import exporting from "highcharts/highcharts-more";
import highchartsMore from "highcharts/modules/exporting";
import React, { useRef, useLayoutEffect } from "react";

accessibility(Highcharts);
exporting(Highcharts);
highchartsMore(Highcharts);

const Chart = ({ config, isPlugin }) => {
  const chartRef = useRef();

  useLayoutEffect(() => {
    // TODO: Find better way to set chart height to fit plugin container
    if (isPlugin) {
      config.chart.height = chartRef.current.parentElement.offsetHeight - 32;
    }

    Highcharts.chart(chartRef.current, config);
  }, [config, chartRef, isPlugin]);

  return <div ref={chartRef} />;
};

Chart.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Chart;
