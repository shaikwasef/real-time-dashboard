cube(`RegRisksByStatus`, {
  sql: `SELECT * FROM \`RegHub\`.reg_config_status_risk`,

  sqlAlias : `RegRisByStat`,
  
  refreshKey: {
    every: `30 minute`,
  },

  dimensions: {
    riskStatus: {
      sql: `${CUBE}.\`status.risk.name\``,
      type: `string`,
      title: `Status`,
    },
    riskId: {
      sql: `${CUBE}.\`status.risk.id\``,
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
