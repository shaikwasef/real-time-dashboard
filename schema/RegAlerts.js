cube(`RegAlerts`, {
  sql: `SELECT * FROM \`RegHub\`.reg_alert_parents where \`RegHub\`.reg_alert_parents.archived=0`,
  sqlAlias: `RegAl`,

  refreshKey: {
    every: `6 hour`
  },

  joins: {
    RegCorpus: {
      relationship: `belongsTo`,
      sql: `${CUBE}.\`info.repo\` = ${RegCorpus}.id`
    },
    RegAlertsAgencynames: {
      relationship: `belongsTo`,
      sql: `${CUBE}.\`_id\` = ${RegAlertsAgencynames}._id`
    },
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`owner\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`
    },
    alertsByGeography: {
      relationship: `belongsTo`,
      sql: `${CUBE}.\`jurisdiction\` = ${alertsByGeography}.descendantJurisId`
    },
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    },
    RegJurisdictions: {
      relationship: `hasOne`,
      sql: `${CUBE}.\`jurisdiction\` = ${RegJurisdictions.jurisdictionId}`
    }
  },

  preAggregations: {
    alertsByStatusReportsRollUp: {
      sqlAlias: "alByStatRepsRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [RegAlerts.unread, RegAlerts.applicable, RegAlerts.inProcess],
      dimensions: [tenants.tenantId, RegAlerts.alertCategory],
      timeDimension: publishedDate,
      granularity: `day`,
      buildRangeStart: {
        sql: `SELECT NOW() - interval '365 day'`,
      },
      buildRangeEnd: {
        sql: `SELECT NOW()`,
      },
      refreshKey: {
        every: `6 hour`,
      }
    },
    alertsByCorpusReportRollUp: {
      sqlAlias: "alByCorpRepsRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [
        RegAlerts.unread,
        RegAlerts.applicable,
        RegAlerts.inProcess,
        RegAlerts.totalCount,
      ],
      dimensions: [
        tenants.tenantId,
        RegAlerts.alertCategory,
        RegCorpus.corpusName,
      ],
      refreshKey: {
        every: `6 hour`,
      }
    },
    alertsByAgencyRollUp: {
      sqlAlias: "alByAgencyRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [
        RegAlerts.unread,
        RegAlerts.applicable,
        RegAlerts.inProcess,
        RegAlerts.totalCount,
      ],
      dimensions: [
        tenants.tenantId,
        RegAlerts.alertCategory,
        RegAlertsAgencynames.agencyNames,
      ],
      refreshKey: {
        every: `6 hour`,
      }
    },
    alertsByUsersRollUp: {
      sqlAlias: "alByUsrsRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [
        RegAlerts.unread,
        RegAlerts.applicable,
        RegAlerts.inProcess,
        RegAlerts.totalCount,
      ],
      dimensions: [tenants.tenantId, users.fullName, RegAlerts.alertCategory],
      refreshKey: {
        every: `6 hour`,
      }
    },
    feedPerJurisdictionRollUp: {
      sqlAlias: "feedRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [
        RegAlerts.unreadFeedCount,
        RegAlerts.applicableFeedCount,
        RegAlerts.inProcessFeedCount,
        RegAlerts.feedCount,
      ],
      dimensions: [
        tenants.tenantId,
        RegJurisdictions.displayName,
        RegAlerts.feedName,
        RegAlerts.alertCategory,
      ],
      timeDimension: publishedDate,
      granularity: `month`,
      buildRangeStart: {
        sql: `SELECT NOW() - interval '365 day'`,
      },
      buildRangeEnd: {
        sql: `SELECT NOW()`,
      },
      refreshKey: {
        every: `6 hour`,
      }
    },
    alertsRulesRollUp: {
      sqlAlias: "alRuleRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [
        RegAlerts.unread,
        RegAlerts.applicable,
        RegAlerts.inProcess,
        RegAlerts.totalCount,
      ],
      dimensions: [
        tenants.tenantId,
        RegJurisdictions.displayName,
        RegAlerts.alertType,
        RegAlerts.alertCategory,
      ],
      timeDimension: publishedDate,
      granularity: `month`,
      buildRangeStart: {
        sql: `SELECT NOW() - interval '365 day'`,
      },
      buildRangeEnd: {
        sql: `SELECT NOW()`,
      },
      refreshKey: {
        every: `6 hour`,
      }
    },
    activeBillsByJurisdictionRollUp: {
      sqlAlias: "actBillsRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [
        RegAlerts.unreadBillsCount,
        RegAlerts.applicableBillsCount,
        RegAlerts.inProcessBillsCount,
      ],
      dimensions: [
        tenants.tenantId,
        RegJurisdictions.displayName,
        RegAlerts.alertCategory,
      ],
      refreshKey: {
        every: `6 hour`,
      }
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [tenantId, created, updated]
    },
    alertsByGeoCount: {
      type: `count`,
      filters: [{ sql: `${CUBE}.status <>'Excluded'` }],
      drillMembers: [tenantId, created, updated, publishedDate, status]
    },
    unread: {
      type: `count`,
      sql: `status`,
      title: `unread`,
      filters: [{ sql: `${CUBE}.status = 'Unread'` }]
    },
    excluded: {
      type: `count`,
      sql: `status`,
      title: `excluded`,
      filters: [{ sql: `${CUBE}.status = 'Excluded'` }]
    },
    applicable: {
      type: `count`,
      sql: `status`,
      title: `Applicable`,
      filters: [{ sql: `${CUBE}.status = 'Applicable'` }]
    },
    inProcess: {
      type: `count`,
      sql: `status`,
      title: `inProcess`,
      filters: [{ sql: `${CUBE}.status = 'In Process'` }]
    },
    totalCount: {
      sql: `${unread} + ${applicable} + ${inProcess}`,
      type: `number`,
      title: "totalCount"
    },
    unreadFeedCount: {
      sql: `status`,
      type: `count`,
      title: "Unread Feed count",
      filters: [
        { sql: `${CUBE}.status = 'Unread' and ${CUBE.srcType} = 'FEED'` }
      ]
    },
    inProcessFeedCount: {
      sql: `status`,
      type: `count`,
      title: "In Process Feed count",
      filters: [
        { sql: `${CUBE}.status = 'In Process' and ${CUBE.srcType} = 'FEED'` }
      ]
    },
    applicableFeedCount: {
      sql: `status`,
      type: `count`,
      title: "Applicable Feed count",
      filters: [
        { sql: `${CUBE}.status = 'Applicable' and ${CUBE.srcType} = 'FEED'` }
      ]
    },
    unreadBillsCount: {
      sql: `status`,
      type: `count`,
      title: "Unread Bills count",
      filters: [
        {
          sql: `${CUBE}.status = 'Unread' and ${CUBE.alertCategory} = 'Bills'`
        }
      ]
    },
    inProcessBillsCount: {
      sql: `status`,
      type: `count`,
      title: "In Process Bills count",
      filters: [
        {
          sql: `${CUBE}.status = 'In Process' and ${CUBE.alertCategory} = 'Bills'`
        }
      ]
    },
    applicableBillsCount: {
      sql: `status`,
      type: `count`,
      title: "Applicable Bills count",
      filters: [
        {
          sql: `${CUBE}.status = 'Applicable' and ${CUBE.alertCategory} = 'Bills'`
        }
      ]
    },
    totalBillsCount: {
      sql: `${unreadBillsCount} + ${applicableBillsCount} + ${inProcessBillsCount}`,
      type: `number`,
      title: "billsCount",
    },
    feedCount: {
      sql: `${unreadFeedCount} + ${applicableFeedCount} + ${inProcessFeedCount}`,
      type: `number`,
      title: "feedCount",
    },
  },

  segments: {
    filterExcludedAlerts: {
      sql: `${CUBE}.\`status\` != 'Excluded'`,
    },
  },

  dimensions: {
    jurisdiction: {
      sql: `jurisdiction`,
      title: `juridiction`,
      type: `string`
    },
    infoRegioncode: {
      sql: `${CUBE}.\`info.regionCode\``,
      type: `string`,
      title: `Info.regioncode`
    },
    infoRepo: {
      sql: `${CUBE}.\`info.repo\``,
      type: `string`,
      title: `Info.repo`
    },
    _id: {
      sql: `_id`,
      type: `string`,
      primaryKey: true
    },
    owner: {
      sql: `TRIM(CONVERT(owner, CHAR))`,
      type: `string`
    },
    status: {
      sql: `status`,
      type: `string`
    },
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    },
    created: {
      sql: `created`,
      type: `time`
    },
    updated: {
      sql: `updated`,
      type: `time`
    },
    archived: {
      sql: `archived`,
      type: `string`
    },
    publishedDate: {
      sql: `publishedDate`,
      type: `time`
    },
    alertCategory: {
      sql: `${CUBE}.\`alertCategory\``,
      type: `string`,
      title: `Alert Category`
    },
    feedName: {
      sql: `${CUBE}.\`meta.feedName\``,
      type: `string`,
      title: `Feed Name`
    },
    srcType: {
      sql: `${CUBE}.\`meta.srcType\``,
      type: `string`,
      title: `Source Type`
    },
    alertType: {
      sql: `${CUBE}.\`alertType\``,
      type: `string`,
      title: `Alert Rule`
    },
  },

  dataSource: `default`
});
