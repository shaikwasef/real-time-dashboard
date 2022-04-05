cube(`RegConfig`, {
  sql: `SELECT * FROM \`RegHub\`.reg_config`,

  sqlAlias: `RegConf`,

  refreshKey: {
    every: `30 minute`,
  },

  joins: {
    RegMapStatus: {
      relationship: `hasOne`,
      sql: `${CUBE.tenantId} = ${RegMapStatus.tenantId}`,
    },
    RegTasksByStatus: {
      relationship: `hasMany`,
      sql: `${CUBE._id} = ${RegTasksByStatus._id}`,
    },
    RegControlsBystatus: {
      relationship: `hasMany`,
      sql: `${CUBE._id} = ${RegControlsBystatus._id}`,
    },
    RegRisksByStatus: {
      relationship: `hasMany`,
      sql: `${CUBE._id} = ${RegRisksByStatus._id}`,
    },
  },

  dimensions: {
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`,
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
    },
  },
  dataSource: `default`,
});
