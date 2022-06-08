cube(`RegAlertsAgencynamesEnfActions`, {
  sql: `SELECT * FROM \`RegHub\`.\`reg_ea_alerts_agencyNames\``,
  sqlAlias: `RegAlAgEnfAc`,

  refreshKey: {
    every: `1 day`
  },

  preAggregations: {
    agencyNamesRollUp: {
      sqlAlias: `agencyNamesEnfRP`,
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [RegAlertsAgencynamesEnfActions.count],
      dimensions: [
        RegAlertsAgencynamesEnfActions._id,
        RegAlertsAgencynamesEnfActions.agencyNames,
      ],
      refreshKey: {
        every: `1 day`
      }
    }
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
