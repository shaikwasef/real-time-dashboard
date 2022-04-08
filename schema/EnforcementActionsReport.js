cube(`EnforcementActionsReport`, {
  sql: `SELECT * FROM \`RegHub\`.reg_alert_parents where \`RegHub\`.reg_alert_parents.archived=0 and \`RegHub\`.reg_alert_parents.alertCategory='EA'`,
  sqlAlias: `eARep`,

  refreshKey: {
    every: `1 day`
  },

  joins: {
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    },
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`owner\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`
    },
    RegAlertsAgencynames: {
      relationship: `hasMany`,
      sql: `${CUBE}._id = ${RegAlertsAgencynames}._id`
    }
  },

  preAggregations: {
    noEnforcementActionsReportRollUp: {
      sqlAlias: `noEnfRP`,
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [EnforcementActionsReport.count],
      dimensions: [RegAlertsAgencynames.agencyNames, tenants.tenantId],
      timeDimension: EnforcementActionsReport.effectiveDate,
      granularity: `month`,
      buildRangeStart: {
        sql: `SELECT NOW() - interval '365 day'`,
      },
      buildRangeEnd: {
        sql: `SELECT NOW()`,
      },
      refreshKey: {
        every: `1 day`,
      },
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [tenantid]
    },
    AggregatedPenalties: {
      sql: `COALESCE(${CUBE}.\`info.penaltyAmount.value\` + ${CUBE}.\`info.restitutionAmount.value\`, ${CUBE}.\`info.restitutionAmount.value\`, ${CUBE}.\`info.penaltyAmount.value\` , 0) `,
      type: `sum`
    }
  },

  dimensions: {
    _id: {
      sql: `_id`,
      type: `string`,
      primaryKey: true
    },
    effectiveDate: {
      sql: `${CUBE}.\`effectiveDate\``,
      type: `time`
    },
    currency: {
      sql: `${CUBE}.\`info.penaltyAmount.currency\``,
      type: `string`
    },
    tenantid: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    }
  }
});
