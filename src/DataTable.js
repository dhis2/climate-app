import classes from "./DataTable.module.css";

const DataTable = ({ data, orgUnits }) => {
  const periods = [...new Set(data.map((d) => d.period))];

  console.log("data", JSON.stringify(data));

  return (
    <div className={classes.wrapper}>
      <table className={classes.dataTable}>
        <thead>
          <tr>
            <th>Org Unit</th>
            {periods.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orgUnits.map((ou) => (
            <tr key={ou.id}>
              <th>{ou.properties.name}</th>
              {periods.map((d) => (
                <td key={d}>
                  {data.find((v) => v.ou === ou.id && v.period === d)?.value ??
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
