cube(`PenaltiesAndRestitutions`, {
  sql: `SELECT * FROM \`RegHub\`.reg_ea_alerts where \`RegHub\`.reg_ea_Alerts.archived=0 `,
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
    },
    RegAlertsAgencynamesEnfActions: {
      relationship: `hasMany`,
      sql: `${CUBE}._id = ${RegAlertsAgencynamesEnfActions}._id`
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
  },
});
