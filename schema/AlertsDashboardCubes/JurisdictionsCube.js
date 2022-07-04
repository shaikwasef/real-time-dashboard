import { JURISDICTIONS_CUBE_REFRESH_KEY_TIME } from "./cube-constants";
import { juridictionsCollection } from "./collections";

cube(`JurisdictionsCube`, {
  sql: `SELECT jurisdictionId , displayName , tenantId FROM ${juridictionsCollection}`,
	
  sqlAlias: `JursCube`,

  refreshKey: {
    every: JURISDICTIONS_CUBE_REFRESH_KEY_TIME,
  },

  joins: {
    Tenants: {
      relationship: `hasOne`,
      sql: `TRIM(CONVERT(${CUBE.tenantId}, CHAR)) = TRIM(CONVERT(${Tenants.tenantId}, CHAR))`
    },
  },

  dimensions: {
    jurisdictionId: {
      sql: `${CUBE}.\`jurisdictionId\``,
      title: `Jurisdiction`,
      type: `string`,
      primaryKey: true
    },
    displayName: {
      sql: `${CUBE}.\`displayName\``,
      title: `Jurisdiction Name`,
      type: `string`
    },
		tenantId: {
      sql: `CONVERT(${CUBE}.\`tenantId\`, CHAR)`,
      type: `string`,
			title: `Tenant Id`
    }
  },

  dataSource: `default`
});
