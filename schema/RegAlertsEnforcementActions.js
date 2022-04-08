cube(`RegAlertsEnforcementActions`, {
  sql: `SELECT _id , tenantId , owner FROM \`RegHub\`.reg_alert_parents where \`RegHub\`.reg_alert_parents.archived=0 and \`RegHub\`.reg_alert_parents.alertCategory ='EA'`,
  sqlAlias : `RegAlEnfAc`,

  refreshKey: {
    every: `1 day`
  },

  joins: {
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`owner\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`
    },
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE.tenantId}, CHAR)) = TRIM(CONVERT(${tenants.tenantId}, CHAR))`
    },
    RegAlertsAgencynames: {
      relationship: `hasMany`,
      sql: `${CUBE._id} = ${RegAlertsAgencynames._id}`
    },
  },

  preAggregations: {
    regAlertsEnfActionsRollUp: {
      sqlAlias: `regAlEnfroll`,
      external: true,
      scheduledRefresh: true,
      dimensions: [RegAlertsEnforcementActions._id, tenants.tenantId],
      refreshKey: {
        every: `1 day`,
      }
    },
    actionsByAgencyRollUpJoin: {
      sqlAlias: `HAGroll`,
      type: `rollupJoin`,
      external: true,
      measures: [RegAlertsAgencynames.count],
      dimensions: [
        RegAlertsAgencynames.agencyNames,
        RegHarmonizedActionType.harmonizedActionType,
        tenants.tenantId,
      ],
      rollups: [
        RegAlertsAgencynames.agencyNamesRollUp,
        RegHarmonizedActionType.harmonizedActionsRollUp,
        RegAlertsEnforcementActions.regAlertsEnfActionsRollUp,
      ],
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [tenantId]
    }
  },

  dimensions: {
    _id: {
      sql: `_id`,
      type: `string`,
      primaryKey: true
    },
    owner: {
      sql: `TRIM(CONVERT(owner, CHAR))`,
      type: `string`
    },
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    }
  },

  dataSource: `default`
});
