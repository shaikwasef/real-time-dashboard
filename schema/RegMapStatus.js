cube(`RegMapStatus`, {
  sql: `SELECT * FROM \`RegHub\`.reg_map_status where \`RegHub\`.reg_map_status.archived = 0 `,

  refreshKey: {
    every: `30 minute`,
  },

  sqlAlias: `RegMapSt`,

  joins: {
    tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantid\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    },
    users: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`owner\`, CHAR)) = TRIM(CONVERT(${users}._id, CHAR))`
    },
    RegRisks: {
      relationship: `hasOne`,
      sql: `${CUBE}.\`srcObject\`= ${RegRisks}._id`,
    },
    RegTasks: {
      relationship: `hasOne`,
      sql: `${CUBE}.\`srcObject\`= ${RegTasks}._id`,
    },
    RegControls: {
      relationship: `hasOne`,
      sql: `${CUBE}.\`srcObject\`= ${RegControls}._id`,
    },
    RegControlsBystatus: {
      relationship: `hasOne`,
      sql: `${RegMapStatus.status} = ${RegControlsBystatus.controlId}`,
    },
    RegRisksByStatus: {
      relationship: `hasOne`,
      sql: `${RegMapStatus.status} = ${RegRisksByStatus.riskId}`,
    },
    RegTasksByStatus: {
      relationship: `hasOne`,
      sql: `${RegMapStatus.status} = ${RegTasksByStatus.taskId}`,
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [status, _id]
    }
  },

  preAggregations: {
    controlsRollUp: {
      sqlAlias: "conRollUp",
      external: true,
      measures: [RegMapStatus.count],
      dimensions: [tenants.tenantId, RegControlsBystatus.controlStatus],
      segments: [RegMapStatus.controlType],
      scheduledRefresh: true,
      refreshKey: {
        every: "1 hour",
      },
    },
    risksRollUp: {
      sqlAlias: "risRollUp",
      external: true,
      measures: [RegMapStatus.count],
      dimensions: [tenants.tenantId, RegRisksByStatus.riskStatus],
      segments: [RegMapStatus.riskType],
      scheduledRefresh: true,
      refreshKey: {
        every: "1 hour",
      },
    },
    tasksRollUp: {
      sqlAlias: "tskRollUp",
      external: true,
      measures: [RegMapStatus.count],
      dimensions: [tenants.tenantId, RegTasksByStatus.taskStatus],
      segments: [RegMapStatus.taskType],
      scheduledRefresh: true,
      refreshKey: {
        every: "1 hour",
      },
    },
  },

  segments: {
    riskType: {
      sql: `${CUBE}.\`srcType\` = 'Risk' and ${RegRisks}.archived = 0 and ${RegConfig.tenantId} = ${RegMapStatus.tenantId} and ${RegMapStatus.status} = ${RegRisksByStatus.riskId}`,
    },
    controlType: {
      sql: `${CUBE}.\`srcType\` = 'Control' and ${RegControls}.archived = 0 and ${RegConfig.tenantId} = ${RegMapStatus.tenantId} and ${RegMapStatus.status} = ${RegControlsBystatus.controlId}`,
    },
    taskType: {
      sql: `${CUBE}.\`srcType\` = 'Task' and ${RegTasks}.archived = 0 and ${RegConfig.tenantId} = ${RegMapStatus.tenantId} and ${RegMapStatus.status} = ${RegTasksByStatus.taskId} `,
    },
  },

  dimensions: {
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true
    },
    status: {
      sql: `${CUBE}.\`status\` `,
      type: `string`,
      title: `Status`
    },
    srcObject: {
      sql: `${CUBE}.\`srcObject\``,
      type: `string`,
      title: `Source`
    },
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`,
    },
  },
  dataSource: `default`
});
