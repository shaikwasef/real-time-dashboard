cube(`RegAlertsGrpIds`, {
  sql: `SELECT * FROM \`RegHub\`.\`reg_alert_parents_grpIds\``,
  sqlAlias: `RegAlGrp`,

  refreshKey: {
    every: `1 day`,
  },

  joins: {
    AlertsMeta: {
      relationship: `hasOne`,
      sql: `CONVERT(${CUBE}.\`grpIds\`,CHAR) = CONVERT(${AlertsMeta}.alertGrpId,CHAR)`,
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [_id],
    },
  },

  dimensions: {
    grpIds: {
      sql: `CONVERT(${CUBE}.\`grpIds\`,CHAR)`,
      type: `string`,
      title: `Group Ids`,
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true,
    },
  },

  dataSource: `default`,
});
