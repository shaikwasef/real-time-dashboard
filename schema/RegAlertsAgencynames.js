cube(`RegAlertsAgencynames`, {
  sql: `SELECT * FROM \`RegHub\`.\`reg_alerts_agencyNames\``,
  sqlAlias : `RegAlAg`,

  refreshKey: {
    every: `1 day`,
  },

preAggregations: {
    agencyNamesRollUp: {
      sqlAlias: `agencyNamesRP`,
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [RegAlertsAgencynames.count],
      dimensions: [RegAlertsAgencynames._id, RegAlertsAgencynames.agencyNames],
      refreshKey: {
        every: `1 day`,
      },
    },
},

  measures: {
    count: {
      type: `count`,
      drillMembers: [agencyNames, _id]
    }
  },

  dimensions: {
    agencyNames: {
      sql: `${CUBE}.\`agencyNames\``,
      type: `string`,
      title: `agencyNames`
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true
    }
  },

  dataSource: `default`
});
