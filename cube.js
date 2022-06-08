// Cube.js configuration options: https://cube.dev/docs/config
const defaultTenantId = "598b984f530bf20f645373d3";
// Connection URL

module.exports = {
  http: {
    cors: {
      origin: "http://localhost:8080",
    },
  },
  //adding tenantId filters in query
  queryTransformer: (query, { securityContext }) => {
    const tenantIds = [defaultTenantId];
    // const sc = securityContext;
    // console.log("tenantIds");
    // console.log(sc);
    // tenantId = "60bdf4253f08118fcef4f30a";
    // if (tenantId) {
    //   console.log("Fetching stats for tenentId", tenantId);
    //   tenantIds.push(tenantId);
    // } else {
    //   console.error(
    //     "TenantId is not provided, fetching stats for default tenantId"
    //   );
    // }
    // query.filters.push({
    //   member: "tenants.tenantId",
    //   operator: "equals",
    //   values: tenantIds,
    // });
    return query;
  },

  // contextToAppId: ({ securityContext }) => `C_APP_${securityContext.tenantId}`,

  // preAggregationsSchema: ({ securityContext }) =>
  //   `pr_ag_${securityContext.tenantId}`,

  // scheduledRefreshContexts: async () => {
  //   const tenantIds = await fetchTenants();
  //   return tenantIds.map((id) => {
  //     return { securityContext: { tenantId: id } };
  //   });
  // },
};

// async function fetchTenants() {
//   // Use connect method to connect to the server
//   await client.connect();
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   const collection = db.collection("tenants");
//   let tenantIds = await collection.distinct("_id");
//   tenantIds = tenantIds.map((item) => item.toString());
//   return tenantIds;
// }
