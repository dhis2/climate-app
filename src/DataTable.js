import classes from "./DataTable.module.css";

const DataTable = ({ data, orgUnits }) => {
  const dates = [...new Set(data.map((d) => d.date))];
  console.log("data", data, orgUnits);

  console.log("dates", dates);

  return (
    <div className={classes.wrapper}>
      <table className={classes.dataTable}>
        <thead>
          <tr>
            <th>Org Unit</th>
            {dates.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orgUnits.map((ou) => (
            <tr key={ou.id}>
              <th>{ou.properties.name}</th>
              {dates.map((d) => (
                <td key={d}>
                  {data.find((v) => v.id === ou.id && v.date === d)?.value ??
                    "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
