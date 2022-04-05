cube(`RegulationsImpacted`, {
  sql: `SELECT * FROM \`RegHub\`.reg_alerts where \`RegHub\`.reg_alerts.archived=0 and \`RegHub\`.reg_alerts.alertCategory='EA'`,
  
  refreshKey: {
    every: `1 day`
  },

  sqlAlias: `RegImp`,
  joins: {
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    },
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`owner\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`
    },
    RegRegulations: {
      relationship: `hasMany`,
      sql: `${CUBE}._id = ${RegRegulations}._id`
    }
  },

 preAggregations: {
    authDocImpactedRollUp: {
      sqlAlias: `auDocRoll`,
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [CUBE.count],
      dimensions: [
        RegRegulations.authoritativeDocuments,
        RegRegulations.citations,
        tenants.tenantId,
      ],
      timeDimension: CUBE.effectiveDate,
      granularity: `month`,
      refreshKey: {
        every: "1 hour",
      },
      buildRangeStart: {
        sql: `SELECT NOW() - interval '365 day'`,
      },
      buildRangeEnd: {
        sql: `SELECT NOW()`,
      },
    },
  },
 
  measures: {
    count: {
      type: `count`,
      drillMembers: [tenantid]
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
    tenantid: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    }
  }
});
