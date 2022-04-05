cube(`RegTasks`, {
  sql: `SELECT * FROM \`RegHub\`.tasks where \`RegHub\`.tasks.archived = 0`,

  extends: users,

  sqlAlias : `RegTsk`,
  
  refreshKey: {
    every: `30 minute`
  },
  measures: {
    count: {
      type: `count`,
      drillMembers: [tasks, _id]
    }
  },

  dimensions: {
    tasks: {
      sql: `${CUBE}.\`id\``,
      type: `string`,
      title: `Task`
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true
    },
    archived: {
      sql: `${CUBE}.\`archived\``,
      type: `boolean`,
      title: `archivedTasks`,
    },
  },

  dataSource: `default`
});
