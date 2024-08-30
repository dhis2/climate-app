import PropTypes from "prop-types";
import Highcharts from "highcharts";
import accessibility from "highcharts/modules/accessibility";
import exporting from "highcharts/highcharts-more";
import highchartsMore from "highcharts/modules/exporting";
import React, { useCallback, useRef, useLayoutEffect, useMemo } from "react";

accessibility(Highcharts);
exporting(Highcharts);
highchartsMore(Highcharts);

const Chart = ({ config, isPlugin }) => {
    const containerRef = useRef(null);
    const chartRef = useRef();

    const titleHeight = 32;

    const onResize = useCallback(() => {
        chartRef.current?.setSize(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight,
            false
        );
    }, []);

    const sizeObserver = useMemo(
        () => new window.ResizeObserver(onResize),
        [onResize]
    );

    const mountAndObserveContainerRef = useCallback(
        (node) => {
            if (node === null) {
                return;
            }

            containerRef.current = node;
            sizeObserver.observe(node);

            return sizeObserver.disconnect;
        },
        [sizeObserver]
    );

    useLayoutEffect(() => {
        chartRef.current = new Highcharts.chart(containerRef.current, config);
    }, [config, chartRef]);

    return (
        <div
            style={{
                height: `calc(100% - ${isPlugin ? titleHeight : 0}px)`,
                width: "100%",
            }}
            ref={mountAndObserveContainerRef}
        />
    );
};

Chart.propTypes = {
    config: PropTypes.object.isRequired,
    isPlugin: PropTypes.bool,
};

export default Chart;
