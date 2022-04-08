cube(`RegMapOwners`, {
  sql: `
  SELECT * FROM (SELECT
  _id,
  owner AS user,
  tenantId,
  'Tasks' AS item_type
  FROM ${RegTasks.sql()} as tasksT union all
  SELECT
  Risks._id,
  Users.user AS user,
  Risks.tenantId,
  'Risks' AS item_type
  FROM ${RegRisks.sql()} AS Risks INNER JOIN ${RegMapUser.sql()} AS Users ON Risks._id = Users.srcObject union all
  SELECT
  Controls._id,
  Users.user AS user,
  Controls.tenantId,
  'Controls' AS item_type
  FROM  ${RegControls.sql()} AS Controls INNER JOIN ${RegMapUser.sql()} AS Users ON Controls._id = Users.srcObject
  ) as MapOwners
 `,

  sqlAlias: `RegMapOw`,

  refreshKey: {
    every: `30 minute`,
  },

  joins: {
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`user\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`,
    },
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`,
    },
  },

  preAggregations: {
    ownersRollUp: {
      sqlAlias: `oRollUp`,
      external: true,
      scheduledRefresh: true,
      measures: [
        RegMapOwners.controlCount,
        RegMapOwners.riskCount,
        RegMapOwners.taskCount,
        RegMapOwners.total,
      ],
      dimensions: [tenants.tenantId, users.fullName],
      refreshKey: {
        every: "1 hour",
      },
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [tenantId],
    },
    taskCount: {
      type: `count`,
      filters: [{ sql: `${CUBE}.item_type = 'Tasks'` }],
    },
    riskCount: {
      type: `count`,
      filters: [{ sql: `${CUBE}.item_type = 'Risks'` }],
    },
    controlCount: {
      type: `count`,
      filters: [{ sql: `${CUBE}.item_type = 'Controls'` }],
    },
    total: {
      type: `count`,
    },
  },

  dimensions: {
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true,
    },
    ownerId: {
      sql: `${CUBE}.\`user\``,
      type: `string`,
    },
    tenantId: {
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`,CHAR))`,
      type: `string`,
    },
  },

  dataSource: `default`,
});
