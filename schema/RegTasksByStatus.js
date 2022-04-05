cube(`RegTasksByStatus`, {
  sql: `SELECT * FROM \`RegHub\`.reg_config_status_task`,

  sqlAlias :`RegTskByStat`,
  
  refreshKey: {
    every: `30 minute`,
  },

  dimensions: {
    taskStatus: {
      sql: `${CUBE}.\`status.task.name\``,
      type: `string`,
      title: `Status`,
    },
    taskId: {
      sql: `${CUBE}.\`status.task.id\``,
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
