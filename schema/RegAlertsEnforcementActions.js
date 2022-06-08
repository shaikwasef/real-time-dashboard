cube(`RegAlertsEnforcementActions`, {
  sql: `SELECT _id , tenantId , owner FROM \`RegHub\`.reg_ea_alerts where \`RegHub\`.reg_ea_Alerts.archived=0 `,
  sqlAlias: `RegAlEnfAc`,

  refreshKey: {
    every: `1 day`,
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
    RegAlertsAgencynamesEnfActions: {
      relationship: `hasMany`,
      sql: `${CUBE._id} = ${RegAlertsAgencynamesEnfActions._id}`
    }
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
      measures: [RegAlertsAgencynamesEnfActions.count],
      dimensions: [
        RegAlertsAgencynamesEnfActions.agencyNames,
        RegHarmonizedActionType.harmonizedActionType,
        tenants.tenantId,
      ],
      rollups: [
        RegAlertsAgencynamesEnfActions.agencyNamesRollUp,
        RegHarmonizedActionType.harmonizedActionsRollUp,
        RegAlertsEnforcementActions.regAlertsEnfActionsRollUp,
      ],
    },
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
