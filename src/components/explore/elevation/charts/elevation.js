const getChartConfig = (name, data) => {
    console.log('config', name, data)

    const elevations = Object.keys(data.elevation)
    const values = Object.values(data.elevation)

    /*
    const series = elevations.map((elevation) => ({
        x: Number(elevation),
        y: values[elevation],
    }))
    */

    const series = values

    const minElevation = Number(elevations[0])
    const maxElevation = Number(elevations[elevations.length - 1])

    console.log('elevations', minElevation, maxElevation, series)

    // frequency / histogram
    // https://www.linkedin.com/pulse/histograms-dem-values-chonghua-yin/
    // https://gsp.humboldt.edu/olm/Lessons/GSP_270/HTML%205%20Canvas%20Lessons/Histograms2.html

    return {
        title: {
            text: 'Elevation',
        },
        // credits: vegetationCredits,
        tooltip: {
            // crosshairs: true,
            // shared: true,
            // valueSuffix: '°C',
        },
        yAxis: {
            /*
            type: 'datetime',
            tickInterval: 2592000000,
            labels: {
                format: '{value: %b}',
            },
            */
            // title: 'Area',
            title: {
                text: 'Area',
            },
            min: 0,
            max: 20000,
        },
        xAxis: {
            title: {
                text: 'Elevation',
            },
            min: minElevation,
            max: maxElevation,
        },
        chart: {
            type: 'area',
            // inverted: true,
            height: 480,
            marginBottom: 75,
        },
        /*
        plotOptions: {
            series: {
                animation,
            },
            column: {
                borderColor: null,
                pointPadding: 0,
                groupPadding: 0,
            },
        },
        */
        series: [
            {
                data: series,
                name: 'Elevation',
            },
        ],
    }
}

export default getChartConfig
