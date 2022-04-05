cube(`RegControlsBystatus`, {
  sql: `SELECT * FROM \`RegHub\`.reg_config_status_control`,

  refreshKey: {
    every: `30 minute`,
  },

  sqlAlias : `RegConByStat`,

  dimensions: {
    controlStatus: {
      sql: `${CUBE}.\`status.control.name\``,
      type: `string`,
      title: `Status`,
    },
    controlId: {
      sql: `${CUBE}.\`status.control.id\``,
      type: `string`,
      primaryKey: true,
      shown: true,
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
    },
  },
  
  dataSource: `default`,
});
