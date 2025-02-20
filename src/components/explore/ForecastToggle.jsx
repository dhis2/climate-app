import React, { useState } from "react";
import { Switch, Box } from "@dhis2/ui";

const ForecastToggle = ({ onChange }) => {
    const [showForecast, setShowForecast] = useState(false);

    const handleToggle = () => {
        console.log('forecast toggler', showForecast)
        setShowForecast(!showForecast);
        onChange(!showForecast); // Pass state to parent component
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