import { useEffect } from "react";
import { TabBar, Tab } from "@dhis2/ui";
import {
  Outlet,
  useOutletContext,
  useLocation,
  useNavigate,
} from "react-router-dom";
import exploreStore from "../../utils/exploreStore";
import useExploreUri from "../../hooks/useExploreUri";
import styles from "./styles/Tabs.module.css";

const tabs = [
  { id: "forecast10days", label: "10 days forecast", pointOnly: true },
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
  { id: "humidity", label: "Humidity" },
  { id: "climatechange", label: "Climate change" },
];

const Tabs = () => {
  const { pathname } = useLocation();
  const orgUnit = useOutletContext();
  const navigate = useNavigate();

  const { tab, setTab } = exploreStore();

  const uri = useExploreUri();

  const isPoint = orgUnit.geometry.type === "Point";

  useEffect(() => {
    if (uri && uri !== pathname) {
      navigate(uri);
    }
  }, [pathname, uri, navigate]);

  return (
    <>
      <TabBar fixed>
        {tabs
          .filter((t) => !t.pointOnly || t.pointOnly === isPoint)
          .map(({ id, label }) => (
            <Tab key={id} selected={tab === id} onClick={() => setTab(id)}>
              {label}
            </Tab>
          ))}
      </TabBar>
      <div className={styles.tabContent}>
        <Outlet context={orgUnit} />
      </div>
    </>
  );
};

export default Tabs;
