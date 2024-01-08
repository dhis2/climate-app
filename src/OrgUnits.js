import { useDataQuery } from "@dhis2/app-runtime";
import DataFetch from "./DataFetch";

const orgUnitQuery = {
  geojson: {
    resource: "organisationUnits.geojson",
    params: ({ orgUnitParams }) => orgUnitParams,
  },
};

// As an example: all chiefdoms in Bo district, Sierra Leone
const orgUnitParams = {
  level: 3, // chiefdoms
  parent: "O6uvpzGd5pu", // Bo district
};

const OrgUnits = () => {
  const { data } = useDataQuery(orgUnitQuery, {
    variables: { orgUnitParams },
  });

  return data ? (
    <DataFetch orgUnits={data.geojson.features} />
  ) : (
    <div>Fetching org units...</div>
  );
};

export default OrgUnits;
