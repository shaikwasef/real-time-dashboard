cube(`RegHarmonizedActionType`, {
  sql: `SELECT * FROM \`RegHub\`.\`reg_alert_parents_info_harmonizedActionType\``,
  sqlAlias : `RegHaAcType`,

  refreshKey: {
    every: `1 day`,
  },
  
  joins: {
    RegAlertsEnforcementActions: {
      relationship: `belongsTo`,
      sql: `${CUBE._id} = ${RegAlertsEnforcementActions._id}`
    }
  },

  preAggregations: {
    harmonizedActionsRollUp: {
      sqlAlias: `hrmActionRP`,
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      dimensions: [
        RegHarmonizedActionType._id,
        RegHarmonizedActionType.harmonizedActionType,
      ],
      refreshKey: {
        every: `1 day`,
      },
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [harmonizedActionType, _id]
    }
  },

  dimensions: {
    harmonizedActionType: {
      sql: `${CUBE}.\`info.harmonizedActionType\``,
      type: `string`,
      title: `harmonizedActionType`
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true
    }
  },

  dataSource: `default`
});
