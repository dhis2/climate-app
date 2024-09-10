const ORG_UNIT_QUERY = {
  ou: {
    resource: "organisationUnits",
    id: ({ id }) => id,
  },
};

// https://tkdodo.eu/blog/react-query-meets-react-router
const orgUnitLoader =
  (engine) =>
  async ({ params }) =>
    engine
      .query(ORG_UNIT_QUERY, {
        variables: { id: params.orgUnitId },
      })
      .then(({ ou }) => ({
        type: "Feature",
        id: ou.id,
        geometry: ou.geometry,
        properties: {
          name: ou.displayName,
        },
        path: ou.path,
      }));

export default orgUnitLoader;
