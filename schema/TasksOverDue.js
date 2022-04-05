cube(`TasksOverdue`, {
  sql: `SELECT * FROM \`RegHub\`.tasks`,

  refreshKey: {
    every: `30 minute`,
  },
  
  sqlAlias: `TsksOvDue`,

  preAggregations: {
    tasksRollUp: {
      sqlAlias: "tRollUp",
      external: true,
      measures: [CUBE.count],
      dimensions: [tenants.tenantId, CUBE.dueDate],
      scheduledRefresh: true,
      refreshKey: {
        every: "1 hour",
      },
    },
  },

  joins: {
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    },
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`owner\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`
    }
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
    dueDate: {
      type: `string`,
      case: {
        when: [
          {
            sql: `DATEDIFF(CURRENT_TIMESTAMP, ${CUBE}.\`dueDate\`) > 365`,
            label: `i18n_LBL_1_OVER_YEAR`
          },
          {
            sql: `DATEDIFF(CURRENT_TIMESTAMP, ${CUBE}.\`dueDate\`) > 30`,
            label: `i18n_LBL_2_OVER_MONTH`
          },
          {
            sql: `DATEDIFF(CURRENT_TIMESTAMP, ${CUBE}.\`dueDate\`) > 7`,
            label: `i18n_LBL_3_OVER_WEEK`
          },
          {
            sql: `DATEDIFF(CURRENT_TIMESTAMP, ${CUBE}.\`dueDate\`) > 1`,
            label: `i18n_LBL_4_OVER_DAY`
          }
        ]
      }
    }
  },
  dataSource: `default`
});
