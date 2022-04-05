cube(`AlertsMeta`, {
  sql: `SELECT * FROM \`RegHub\`.alerts_meta`,
  joins: {
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${AlertsMeta.tenantId}, CHAR)) = TRIM(CONVERT( ${tenants}.tenantId, CHAR))`
    }
  },
  sqlAlias: `aMeta`,

  refreshKey: {
    every: `6 hour`
  },

  preAggregations: {
    alertsByTopicRollUp: {
      sqlAlias: "alByTopicRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [
        AlertsMeta.alertsUnread,
        AlertsMeta.alertsInProcess,
        AlertsMeta.alertsApplicable,
      ],
      dimensions: [AlertsMeta.alertgrpName, tenants.tenantId],
      refreshKey: {
        every: `6 hour`,
      },
    },
  },
   
  measures: {
    count: {
      type: `count`,
      drillMembers: [alertGrpId, alertgrpName, tenantId, created, updated]
    },
    alertsUnread: {
      type: `sum`,
      sql: `${CUBE}.\`meta.status.Unread\``,
    },
    alertsInProcess: {
      type: `sum`,
      sql: `${CUBE}.\`meta.status.In Process\``,
    },
    alertsApplicable: {
      type: `sum`,
      sql: `${CUBE}.\`meta.status.Applicable\``,
    },
    alertsGroupCount: {
      sql: `${alertsApplicable} + ${alertsUnread} + ${alertsInProcess}`,
      type: `number`,
    },
  },

  dimensions: {
    alertGrpId: {
      sql: `${CUBE}.\`alertGrpId\``,
      type: `string`
    },
    alertgrpName: {
      sql: `${CUBE}.\`alertGrpName\``,
      type: `string`
    },
    tenantId: {
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`,CHAR))`,
      type: `string`,
      primaryKey: true,
      shown: true
    },
    created: {
      sql: `created`,
      type: `time`
    },
    updated: {
      sql: `updated`,
      type: `time`
    }
  },

  dataSource: `default`
});
