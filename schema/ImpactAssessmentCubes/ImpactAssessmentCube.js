import {impactAssessmentCollection} from './collections';
import { IMPACT_ASSESSMENT_CUBE_REFRESH_KEY_TIME} from './cube-constants';

cube(`ImpactAssessmentCube`, {
  sql: `SELECT * FROM ${impactAssessmentCollection} where ${impactAssessmentCollection}.archived=0`,

  sqlAlias: `impAsCube`,

  refreshKey: {
    every: IMPACT_ASSESSMENT_CUBE_REFRESH_KEY_TIME
  },

  joins: {
		Tenants: {
      relationship: `hasOne`,
      sql :`${CUBE.tenantId} = ${Tenants.tenantId}` 
    },
		ImpactAssessmentOwnersCube: {
      relationship: `belongsTo`,
      sql: `${CUBE._id} = ${ImpactAssessmentOwnersCube._id}`
    }
  },

  measures: {
    count: {
      type: `count`
    },
  },

  dimensions: {
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    },
		startDate: {
      sql: `${CUBE}.\`startDate\``,
      type: `time`
    },
		_id: {
      sql: `CONVERT(${CUBE}.\`_id\`,CHAR)`,
      type: `string`,
      primaryKey: true
    }
  },

  dataSource: `default`,
});
