cube(`RegAgencies`, {
  sql: `SELECT * FROM \`RegHub\`.reg_agencies`,
  sqlAlias : `RegAg` ,
  
  refreshKey: {
    every: `30 minute`,
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, jurisdictionid, name, parentId, tenantid, updated],
    },
  },

  dimensions: {
    description: {
      sql: `description`,
      type: `string`,
    },
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },
    jurisdictionid: {
      sql: `${CUBE}.\`jurisdictionId\``,
      type: `string`,
      primaryKey: true,
    },
    lineage: {
      sql: `lineage`,
      type: `string`,
    },
    name: {
      sql: `name`,
      type: `string`,
    },
    parent: {
      sql: `parent`,
      type: `string`,
    },
    parentId: {
      sql: `parent_id`,
      type: `string`,
    },
    regioncode: {
      sql: `${CUBE}.\`regionCode\``,
      type: `string`,
    },
    shortcode: {
      sql: `${CUBE}.\`shortCode\``,
      type: `string`,
    },
    tenantid: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`,
    },
    url: {
      sql: `url`,
      type: `string`,
    },
    updated: {
      sql: `updated`,
      type: `time`,
    },
  },

  dataSource: `default`,
});
