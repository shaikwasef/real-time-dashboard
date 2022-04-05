cube(`RegControls`, {
  sql: `SELECT * FROM \`RegHub\`.controls where \`RegHub\`.controls.archived = 0`,
  extends: users,
  sqlAlias : `RegCon`,
  
  refreshKey: {
    every: `30 minute`
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [controls, _id]
    }
  },

  dimensions: {
    controls: {
      sql: `${CUBE}.\`id\``,
      type: `string`,
      title: `Controls`
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true
    },
    archived: {
      sql: `${CUBE}.\`archived\``,
      type: `boolean`,
      title: `archivedControls`,
    },
  },

  dataSource: `default`
});
