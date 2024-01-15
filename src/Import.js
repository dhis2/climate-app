import { useEffect } from "react";
import data from "./data/sierra-leone-bo-level3.json";

const dataSetId = "";
const dataElementId = "";

const Import = () => {
  useEffect(() => {
    console.log(data);
  }, []);

  return <div>Import data</div>;
};

export default Import;
