cube(`tenants`, {
  sql: `select '598b984f530bf20f645373d3' as tenantId
        union all
        SELECT _id as tenantId FROM \`RegHub\`.tenants`,

  sqlAlias : `tnts`,

  measures: {
    count: {
      type: `count`,
      drillMembers: [tenantId]
    }
  },

  dimensions: {
    tenantId: {
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`, CHAR))`,
      type: `string`,
      primaryKey: true,
      shown: true
    }
  },

  dataSource: `default`
});
