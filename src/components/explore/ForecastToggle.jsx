import React, { useState } from "react";
import { Switch, Box } from "@dhis2/ui";
import exploreStore from '../../store/exploreStore.js'

const ForecastToggle = () => {
    const { showForecast, setShowForecast } = exploreStore()
    
    console.log('forecast toggler will be set to', showForecast)

    const handleToggle = () => {
        console.log('forecast toggler', showForecast)
        setShowForecast(!showForecast)
    };

    return (
        <Box padding="16px">
            <Switch
                label={showForecast ? "Showing future forecast" : "Include future forecast?"}
                checked={showForecast}
                onChange={handleToggle}
            />
        </Box>
    );
};

export default ForecastToggle;