cube(`PenaltiesAndRestitutions`, {
  sql: ` SELECT * FROM ((SELECT *  FROM \`RegHub\`.reg_ea_alerts where \`RegHub\`.reg_ea_Alerts.archived=0) as enfAlerts  
  INNER JOIN (SELECT _id as Id , agencyNames  FROM \`RegHub\`.\`reg_ea_alerts_agencyNames\`) as enfAlertNames 
  ON enfAlerts._id = enfAlertNames.Id) `,
  
  sqlAlias: `PandR`,

  refreshKey: {
    every: `1 day`,
  },

  joins: {
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`,
    },
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`owner\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`,
    }
  },

  preAggregations: {
    penaltiesAndRestitutionsReportRollUp : {
      sqlAlias: `pandRRepRP`,
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [PenaltiesAndRestitutions.amount],
      dimensions: [PenaltiesAndRestitutions.agencyNames , PenaltiesAndRestitutions.currency , tenants.tenantId],
      timeDimension: PenaltiesAndRestitutions.effectiveDate,
      granularity: `day`,
      buildRangeStart: {
        sql: `SELECT NOW() - interval '365 day'`,
      },
      buildRangeEnd: {
        sql: `SELECT NOW()`,
      },
      refreshKey: {
        every: `1 day`,
      }
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [tenantid],
    },
    amount: {
      type: `sum`,
      sql: `COALESCE(${CUBE}.\`info.penaltyAmount.value\` + ${CUBE}.\`info.RestitutionAmount.value\`,  ${CUBE}.\`info.RestitutionAmount.value\` , ${CUBE}.\`info.penaltyAmount.value\` , 0) `,
    },
  },

  dimensions: {
    _id: {
      sql: `_id`,
      type: `string`,
      primaryKey: true,
    },
    currency: {
      sql: `${CUBE}.\`info.penaltyAmount.currency\``,
      type: `string`,
    },
    effectiveDate: {
      sql: `${CUBE}.\`effectiveDate\``,
      type: `time`,
    },
    tenantid: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`,
    },
    agencyNames: {
      sql: `${CUBE}.\`agencyNames\``,
      type: `string`,
      title: `agencyNames`
    },
  },
});
