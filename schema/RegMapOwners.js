cube(`RegMapOwners`, {
  sql: `SELECT * FROM \`RegHub\`.\`reg_map_user\``,

  sqlAlias: `RegMapOw`,

  refreshKey: {
    every: `30 minute`,
  },
  
  joins: {
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`user\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`,
    },
    RegRisks: {
      relationship: `hasOne`,
      sql: `${CUBE}.\`srcObject\` = ${RegRisks}._id`,
    },
    RegControls: {
      relationship: `hasOne`,
      sql: `${CUBE}.\`srcObject\` = ${RegControls}._id`,
    },
    RegTasks: {
      relationship: `hasOne`,
      sql: `${CUBE}.\`srcObject\`= ${RegTasks}._id`,
    },
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`,
    },
  },

  preAggregations: {
    ownersRollUp: {
      sqlAlias: `oRollUp`,
      external: true,
      measures: [
        RegRisks.count,
        RegControls.count,
        RegTasks.count,
        RegMapOwners.total,
      ],
      dimensions: [tenants.tenantId, RegMapOwners.srcObject, users.fullName],
      refreshKey: {
        every: "1 hour",
      },
      scheduledRefresh:true,
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [srcObject, ownerId, _id],
    },
    total: {
      type: `number`,
      sql: `${RegRisks.count} + ${RegControls.count} + ${RegTasks.count}`,
    },
  },

  dimensions: {
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true,
    },
    srcObject: {
      sql: `${CUBE}.\`srcObject\``,
      type: `string`,
      title: `Source`,
    },
    ownerId: {
      sql: `${CUBE}.\`user\``,
      type: `string`,
    },
    tenantId: {
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`,CHAR))`,
      type: `string`,
    },
  },

  dataSource: `default`,
});
