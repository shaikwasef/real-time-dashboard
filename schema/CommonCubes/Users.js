import { userCollection } from "./collections";
import { USER_CUBE_REFRESH_KEY_TIME } from "./cube-constants";

cube(`Users`, {
  sql: `SELECT _id , fullName , tenantId FROM ${userCollection} `,
  sqlAlias : `usrs`,

  refreshKey: {
    every: USER_CUBE_REFRESH_KEY_TIME
  },
  
  joins: {
    Tenants: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE.tenantId}, CHAR)) = TRIM(CONVERT(${Tenants}.tenantId, CHAR))`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [fullName, tenantId, _id]
    }
  },

  dimensions: {
    _id: {
      sql: `CONVERT(${CUBE}.\`_id\`, CHAR)`,
      type: `string`,
      primaryKey: true,
      shown: true
    },
    fullName: {
      sql: `${CUBE}.\`fullName\``,
      type: `string`
    },
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    }
  },

  dataSource: `default`
});
