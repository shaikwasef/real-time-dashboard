cube(`RegMapUser`, {
  sql: `SELECT user , srcObject FROM \`RegHub\`.reg_map_user where \`RegHub\`.reg_map_user.archived = 0 `,

  refreshKey: {
    every: `30 minute`,
  },

  sqlAlias: `RegMapUs`,

  measures: {
    count: {
      type: `count`,
      drillMembers: [_id],
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
  },
  
  dataSource: `default`,
});
