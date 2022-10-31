// Cube.js configuration options: https://cube.dev/docs/config
const defaultTenantId = "598b984f530bf20f645373d3";
module.exports = {
  http: {
    cors: {
      origin: "http://localhost:8080"
    }
  },
  //adding tenantId filters in query
  queryTransformer: (query, { securityContext }) => {
    const tenantIds = [defaultTenantId , "60bdf4253f08118fcef4f30a"];
    // const sc = securityContext;
    // tenantId = sc.tenantId;
    // if (tenantId) {
    //   console.log("Fetching stats for tenentId", tenantId);
    //   tenantIds.push(tenantId);
    // } else {
    //   console.error(
    //     "TenantId is not provided, fetching stats for default tenantId"
    //   );
    // }
    query.filters.push({
      member: "Tenants.tenantId",
      operator: "equals",
      values: tenantIds
    });
    return query;
  },
};