cube(`RegRisks`, {
  sql: `SELECT * FROM \`RegHub\`.risks where \`RegHub\`.risks.archived = 0`,

  extends: users,

  sqlAlias : `RegRis`,
  
  refreshKey: {
    every: `30 minute`,
  },
  measures: {
    count: {
      type: `count`,
      drillMembers: [risks, _id],
    },
  },
  dimensions: {
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true,
    },
    risks: {
      sql: `${CUBE}.\`id\``,
      type: `string`,
      title: `risks`,
    },
    archived: {
      sql: `${CUBE}.\`archived\``,
      type : `boolean`,
      title : `archivedRisks`
    },
  },
  dataSource: `default`,
});
