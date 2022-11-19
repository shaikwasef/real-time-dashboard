import {regMapStatusCollection, corpusCollection  ,regMapGenericCollection ,regUniregCollection, masterDatumCollection} from "./collections";
import {
	COMPLIANCE_COVERAGE_CUBE_REFRESH_KEY_TIME
} from "./cube-constants";

cube(`ComplianceCoverageCube`, {


sql : `SELECT * FROM 
	((SELECT _id as uniregId , repo , tenantId , corpusId FROM ${regUniregCollection} as regUniregCube INNER JOIN 
	(SELECT id as corpusId FROM ${corpusCollection}) 	as corpusCube on corpusCube.corpusId = regUniregCube.repo)) as checkCube`,

	// sql: `SELECT * FROM 
	// ((SELECT _id,status,srcObject,tenantId,repo FROM ${regMapStatusCollection} 
	// 	as regMapStatus INNER JOIN 
	// (SELECT _id as uniregId , repo FROM ${regUniregCollection}) 
	// 	as regUnireg on regMapStatus.srcObject = regUnireg.uniregId )) 
	// 	as regUniregCube
	// INNER JOIN (SELECT id as corpusId FROM ${corpusCollection}) 
	// 	as corpusCube on corpusCube.corpusId = regUniregCube.repo`,

		// sql: `SELECT * FROM 
	// ((SELECT _id,status,srcObject,tenantId,destObject FROM ${regMapStatusCollection} 
	// 	as regMapStatus INNER JOIN 
	// (SELECT srcObject as mapGenericObject , destObject FROM ${regMapGenericCollection}) 
	// as regMapGeneric on regMapStatus.srcObject = regMapGeneric.mapGenericObject )) 
	// 	as regMapCube
	// INNER JOIN (SELECT _id as masterDatumId , type FROM ${masterDatumCollection}) 
	// 	as masterDatumCube on regMapCube.destObject = masterDatumCube.masterDatumId`,

	sqlAlias: `CompCvrgCube`,

	refreshKey: {
		every: COMPLIANCE_COVERAGE_CUBE_REFRESH_KEY_TIME,
	},

	joins: {
		Tenants: {
			relationship: `hasOne`,
			sql: `${CUBE.tenantId} = ${Tenants.tenantId}`,
		}
	},

	preAggregations: {
	},

	measures: {
	},

	dimensions: {
		_id: {
			sql: `_id`,
			type: `string`,
			primaryKey: true,
		},
		status: {
			sql: `status`,
			type: `string`,
		},
		tenantId: {
			sql: `tenantId`,
			type: `string`,
		},
		type: {
			sql: `type`,
			type: `string`,
			title: `type`
		},
		corpusId : {
			sql: `corpusId`,
			type: `string`,
			title: `corpus id`
		}
	},

	dataSource: `default`,
});
