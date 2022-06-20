cube(`AlertsMeta`, {
  sql: `SELECT alertGrpId , alertGrpName FROM \`RegHub\`.alerts_meta where \`RegHub\`.alerts_meta.grpType != "jurisdiction"`,
  
  sqlAlias: `aMeta`,

  refreshKey: {
    every: `6 hour`
  },

  dimensions: {
    alertGrpId: {
      sql: `CONVERT(${CUBE}.\`alertGrpId\`,CHAR)`,
      type: `string`,
      primaryKey: true,
      shown: true
    },
    alertGrpName: {
      sql: `${CUBE}.\`alertGrpName\``,
      type: `string`
    },
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    },
  },

  dataSource: `default`
});
