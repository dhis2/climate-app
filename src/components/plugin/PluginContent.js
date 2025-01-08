import Forecast from "../explore/forecast/Forecast";

const displays = {
  forecast10days: Forecast,
};

const PluginContent = (props) => {
  const { display } = props;

  const Display = displays[display];

  if (!Display) {
    return <div>Display not found (this should not happen)</div>;
  }

  return <Display {...props} isPlugin={true} />;
};

export default PluginContent;
