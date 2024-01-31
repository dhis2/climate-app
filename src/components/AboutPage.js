import i18n from "@dhis2/d2-i18n";
import styles from "./styles/Page.module.css";

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1>{i18n.t("About this app")}</h1>
      <p>...</p>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube-nocookie.com/embed/FAGobvUGl24?si=nBJeVx1_BPM4X5vF&rel=0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default AboutPage;
