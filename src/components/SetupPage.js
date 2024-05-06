import i18n from "@dhis2/d2-i18n";
import styles from "./styles/SetupPage.module.css";

const SetupPage = () => {
  return (
    <div className={styles.container}>
      <h1>{i18n.t("How to configure this app")}</h1>
      <p>
        {i18n.t(
          "Before you can import weather and climate data, you need to make some configurations in the Maintenance app."
        )}
      </p>
      <p>
        {i18n.t(
          "This app imports daily weather and climate data that can be aggregated to other period types in DHIS2. We don't recommend aggregating across organisation unit levels, especially when going from facility level to higher levels defined by a geographic boundary. To make sure the values remain at its own level, assign all org unit levels as Aggregation levels for each data element below."
        )}
      </p>
      <p>
        {i18n.t(
          "Create DHIS2 data elements for the climate and weather data you want to import. We recommend including the data source (ERA5-Land) in the name to distinguish it from data imported from local weather stations. If you use the same code specified below, we will preselect the data element in the import interface."
        )}
      </p>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Air temperature")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Air temperature (ERA5-Land)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Air temperature")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_LAND_TEMPERATURE</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>
              {i18n.t("Average air temperature in °C at 2m above the surface")}
            </td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Average")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Min air temperature")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Min air temperature (ERA5-Land)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Min air temperatur")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_LAND_TEMPERATURE_MIN</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>
              {i18n.t("Minimum air temperature in °C at 2m above the surface")}
            </td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Min")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Max air temperature")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Max air temperature (ERA5-Land)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Max air temperature")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_LAND_TEMPERATURE_MAX</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>
              {i18n.t("Maximum air temperature in °C at 2m above the surface")}
            </td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Max")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Precipitation")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Precipitation (ERA5-Land)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Precipitation")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_LAND_PRECIPITATION</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>{i18n.t("Total precipitation in mm")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Sum")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Dewpoint temperature")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Dewpoint temperature (ERA5-Land)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Dewpoint temperature")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_LAND_DEWPOINT_TEMPERATURE</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>
              {i18n.t(
                "Temperature in °C at 2m above the surface to which the air would have to be cooled for saturation to occur."
              )}
            </td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Average")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Relative humidity")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Relative humidity (ERA5-Land)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Relative humidity")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_LAND_RELATIVE_HUMIDITY</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>
              {i18n.t(
                "Percentage of water vapor in the air compared to the total amount of vapor that can exist in the air at its current temperature. Calculated using air temperature and dewpoint temperature at 2m above surface."
              )}
            </td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Average")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Heat stress")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Heat stress (ERA5-HEAT)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Heat stress")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_HEAT_UTCI</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>{i18n.t("The universal thermal climate index (UTCI)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Average")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Min heat stress")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Min heat stress (ERA5-HEAT)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Min heat stress")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_HEAT_UTCI_MIN</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>{i18n.t("The universal thermal climate index (UTCI)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Min")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Data element")}: "{i18n.t("Max heat stress")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Max heat stress (ERA5-HEAT)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Max heat stress")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Code")}</th>
            <td>ERA5_HEAT_UTCI_MAX</td>
          </tr>
          <tr>
            <th>{i18n.t("Description")}</th>
            <td>{i18n.t("The universal thermal climate index (UTCI)")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Domain type")}</th>
            <td>{i18n.t("Aggregate")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation type")}</th>
            <td>{i18n.t("Max")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Aggregation levels")}</th>
            <td>
              <em>{i18n.t("Assign all org unit levels")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Since these data elements are collected daily, we recommend they are
        assigned to a daily data set. Assigning to a data set helps to maintain
        a quality metadata and data where integrity, consistency, approvals and
        protection are facilitated. How exactly to define such a data set
        depends on the available users and user groups. Similarly, which of the
        organisation units can collect this daily climate data set depends on
        situated contexts. However, since we can provide data for any
        administrative unit that has defined geographic boundaries we leave that
        decision to users. Most probable choice is all organisation units in
        your system.
      </p>
      <table>
        <caption>
          {i18n.t("Data set")}: "{i18n.t("Climate/Weather")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Climate/Weather")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Climate/Weather")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Period type")}</th>
            <td>{i18n.t("Daily")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Data elements")}</th>
            <td>
              <em>{i18n.t("Assign the above data elements")}</em>
            </td>
          </tr>
          <tr>
            <th>{i18n.t("Organisation units")}</th>
            <td>
              <em>{i18n.t("Select all organisation units in your system")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        {i18n.t(
          "To be able to select the data elements in all the DHIS2 analytics apps you also need to assign them to a data element group:"
        )}
      </p>
      <table>
        <caption>
          {i18n.t("Data element group")}: "{i18n.t("Climate/Weather")}"
        </caption>
        <tbody>
          <tr>
            <th>{i18n.t("Name")}</th>
            <td>{i18n.t("Climate/Weather")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Short name")}</th>
            <td>{i18n.t("Climate/Weather")}</td>
          </tr>
          <tr>
            <th>{i18n.t("Data elements")}</th>
            <td>
              <em>{i18n.t("Assign the above data elements")}</em>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <caption>
          {i18n.t("Legend")}: "{i18n.t("Heat/cold stress")}"
        </caption>
        <thead>
          <tr>
            <th>{i18n.t("Name")}</th>
            <th>{i18n.t("Start value")}</th>
            <th>{i18n.t("End value")}</th>
            <th>{i18n.t("Color")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{i18n.t("Extreme cold stress")}</td>
            <td>-60</td>
            <td>-40</td>
            <td>#0A306B</td>
          </tr>
          <tr>
            <td>{i18n.t("Very strong cold stress")}</td>
            <td>-40</td>
            <td>-27</td>
            <td>#0A529C</td>
          </tr>
        </tbody>
      </table>
      <p>
        {i18n.t(
          "You should now be able to import climate data with this app. Please reach out to us on climate-app@dhis2.org if you have any questions or need help with the setup."
        )}
      </p>
    </div>
  );
};

export default SetupPage;
