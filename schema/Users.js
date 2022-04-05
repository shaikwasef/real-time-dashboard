cube(`users`, {
  sql: `SELECT * FROM \`RegHub\`.users`,
  sqlAlias : `usrs`,
  
  joins: {
    tenants: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [fullName, tenantId, _id]
    }
  },

  dimensions: {
    _id: {
      sql: `TRIM(CONVERT(_id, CHAR))`,
      type: `string`,
      primaryKey: true,
      shown: true
    },
    fullName: {
      sql: `${CUBE}.\`fullName\``,
      type: `string`
    },
    tenantId: {
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`, CHAR))`,
      type: `string`
    }
  },

  dataSource: `default`
});
