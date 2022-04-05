cube(`RegAlerts`, {
  sql: `SELECT * FROM \`RegHub\`.reg_alerts where \`RegHub\`.reg_alerts.archived=0 and \`RegHub\`.reg_alerts.alertCategory !='EA'`,
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
    }
  },

  preAggregations: {
    alertsByStatusReportsRollUp: {
      sqlAlias: "alByStatRepsRP",
      type: `rollup`,
      external: true,
      scheduledRefresh: true,
      measures: [RegAlerts.unread, RegAlerts.applicable, RegAlerts.inProcess],
      dimensions: [tenants.tenantId],
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
      },
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
      dimensions: [tenants.tenantId, RegCorpus.corpusName],
      refreshKey: {
        every: `6 hour`,
      },
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
      dimensions: [tenants.tenantId, RegAlertsAgencynames.agencyNames],
      refreshKey: {
        every: `6 hour`,
      },
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
      dimensions: [tenants.tenantId, users.fullName],
      refreshKey: {
        every: `6 hour`,
      },
    },
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
    }
  },

  segments: {
    filterExcludedAlerts: {
      sql: `${CUBE}.\`status\` != 'Excluded'`
    }
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
    }
  },

  dataSource: `default`
});
