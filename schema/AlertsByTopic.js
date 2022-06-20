cube(`AlertsByTopic`, {
	sql: `
  SELECT * FROM ((SELECT
  status,
  grpIds,
  tenantId,
  alertCategory,
  publishedDate
  FROM \`RegHub\`.reg_alert_parents as alerts INNER JOIN (SELECT _id as Id , grpIds  FROM \`RegHub\`.\`reg_alert_parents_grpIds\`) as GrpIds ON alerts._id = GrpIds.Id )
  ) as AlertsByTopic INNER JOIN ${AlertsMeta.sql()} as AlertsMeta On AlertsByTopic.grpIds = CONVERT(AlertsMeta.alertGrpId,CHAR)`,

  refreshKey: {
    every: `6 hour`,
  },

  sqlAlias: `AlByT`,

  joins: {
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    },
  },

  preAggregations: {
    alertsByTopicRollUp: {
      external: true,
      scheduledRefresh: true,
      sqlAlias: "albyTRP",
      measures: [
        AlertsByTopic.unread,
        AlertsByTopic.applicable,
        AlertsByTopic.inProcess
      ],
      dimensions: [
        AlertsByTopic.grpName,
        AlertsByTopic.alertCategory,
        tenants.tenantId
      ],
      timeDimension: AlertsByTopic.publishedDate,
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
  },

  measures: {
    unread: {
      type: `count`,
      sql: `status`,
      title: `unread`,
      filters: [
        {
          sql: `${CUBE}.status = 'Unread'`,
        },
      ],
    },
    inProcess: {
      type: `count`,
      sql: `status`,
      title: `excluded`,
      filters: [
        {
          sql: `${CUBE}.status = 'In Process'`,
        },
      ],
    },
    applicable: {
      type: `count`,
      sql: `status`,
      title: `Applicable`,
      filters: [
        {
          sql: `${CUBE}.status = 'Applicable'`,
        },
      ],
    },
    totalCount: {
      sql: `${unread} + ${applicable} + ${inProcess}`,
      type: `number`,
      title: "totalCount",
    },
  },

  dimensions: {
    grpIds: {
      sql: `CONVERT(${CUBE}.\`grpIds\`,CHAR)`,
      type: `string`,
      title: `Group Ids`,
    },
    grpName: {
      sql: `CONVERT(${CUBE}.\`alertGrpName\`,CHAR)`,
      type: `string`,
      title: `Group Name`
    },
    publishedDate: {
      sql: `publishedDate`,
      type: `time`,
      title : `Published Date`
    },
    alertCategory: {
      sql: `${CUBE}.\`alertCategory\``,
      type: `string`,
      title: `Alert Category`
    },
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true
    }
  }
});