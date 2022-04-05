cube(`RegJurisdictions`, {
  sql: `SELECT * FROM \`RegHub\`.reg_jurisdictions`,
  sqlAlias : `RegJur`,
  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [
        displayname,
        hidden,
        jurisdictionid,
        shortname,
        tenantid,
        title,
        created,
        updated
      ]
    }
  },

  dimensions: {
    details: {
      sql: `details`,
      type: `string`
    },
    displayname: {
      sql: `${CUBE}.\`displayName\``,
      type: `string`
    },
    hidden: {
      sql: `hidden`,
      type: `string`
    },
    intro: {
      sql: `intro`,
      type: `string`
    },
    jurisdictionid: {
      sql: `${CUBE}.\`jurisdictionId\``,
      type: `string`,
      primaryKey: true
    },
    mapcode: {
      sql: `${CUBE}.\`mapCode\``,
      type: `string`
    },
    order: {
      sql: `order`,
      type: `string`
    },
    parentjurisdiction: {
      sql: `${CUBE}.\`parentJurisdiction\``,
      type: `string`
    },
    references: {
      sql: `references`,
      type: `string`
    },
    regioncode: {
      sql: `${CUBE}.\`regionCode\``,
      type: `string`
    },
    shortname: {
      sql: `${CUBE}.\`shortName\``,
      type: `string`
    },
    tenantid: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    },
    title: {
      sql: `title`,
      type: `string`
    },
    uimapcode: {
      sql: `${CUBE}.\`uiMapCode\``,
      type: `string`
    },
    writeupDetails: {
      sql: `${CUBE}.\`writeup.details\``,
      type: `string`,
      title: `Writeup.details`
    },
    writeupIntro: {
      sql: `${CUBE}.\`writeup.intro\``,
      type: `string`,
      title: `Writeup.intro`
    },
    created: {
      sql: `created`,
      type: `time`
    },
    updated: {
      sql: `updated`,
      type: `time`
    }
  },

  dataSource: `default`
});
