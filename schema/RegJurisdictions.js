cube(`RegJurisdictions`, {
  sql: `SELECT jurisdictionId , displayName , tenantId FROM \`RegHub\`.reg_jurisdictions`,
  sqlAlias: `RegJur`,

  refreshKey: {
    every: `6 hour`,
  },

  joins: {
    tenants: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    },
  },

  dimensions: {
    jurisdictionId: {
      sql: `${CUBE}.\`jurisdictionId\``,
      title: `Jurisdiction`,
      type: `string`,
      primaryKey: true
    },
    displayName: {
      sql: `${CUBE}.\`displayName\``,
      title: `Jurisdiction Name`,
      type: `string`
    },
  },

  dataSource: `default`
});
