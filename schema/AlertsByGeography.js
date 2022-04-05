cube(`alertsByGeography`, {
  sql: `WITH subCollection as
	      (select a.tenantId,
        (select distinct c.shortName from reg_jurisdictions c where c.jurisdictionId =a.parentJurisdiction limit 1) as shortName,
	      (select distinct c.displayName from reg_jurisdictions c where c.jurisdictionId =a.parentJurisdiction limit 1) as displayName,
	      (select distinct c.\`\order\` from reg_jurisdictions c where c.jurisdictionId =a.parentJurisdiction limit 1) as orderNumber,
        (select distinct c.uiMapCode from reg_jurisdictions c where c.jurisdictionId = a.parentJurisdiction limit 1) as uiMapCode,
          a.parentJurisdiction ,
          a.jurisdictionId
          from reg_jurisdictions a where a.parentJurisdiction is not null
	      union all
	      select a.tenantId, a.shortName, a.displayName, a.\`\order\` as orderNumber, a.uiMapCode,  a.jurisdictionId as parentJurisdiction, a.jurisdictionId
          from reg_jurisdictions a where a.parentJurisdiction is null
        )

        select distinct tenantId,
          displayName,
          orderNumber,
          uiMapCode,
          shortName,
          jurisId,
          descendantJurisId
			    from (
					select p.tenantId,
				         p.displayName as displayName,
                 p.orderNumber as orderNumber,
                 p.uiMapCode as uiMapCode,
							   p.shortName as shortName,
                 p.parentJurisdiction as jurisId ,
                 c.jurisdictionId as descendantJurisId
          from subCollection  p
          left join  subCollection  c  on p.parentJurisdiction =left(c.jurisdictionId, length(p.parentJurisdiction))
          union all
					select p.tenantId,
                 p.displayName as displayName,
                 p.\`\order\` as orderNumber ,
                 p.uiMapCode as uiMapCode,
                 p.shortName as shortName ,
                 p.jurisdictionId as jurisId ,
                 p.jurisdictionId as descendantJurisId
          from reg_jurisdictions p  where p.jurisdictionId not in (select parentJurisdiction from subcollection)
          )
        AS derivedRegJuris`,
  sqlAlias : `aByGeo`,  
  joins: {
    tenants: {
      relationship: `belongsTo`,
      sql: `TRIM(CONVERT(${CUBE}.\`tenantId\`, CHAR)) = TRIM(CONVERT(${tenants}.tenantId, CHAR))`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [descendantJurisId, jurisId, displayName, order, shortName]
    }
  },

  dimensions: {
    descendantJurisId: {
      sql: `${CUBE}.\`descendantJurisId\``,
      type: `string`,
      shown: true,
      title: `Descendant Juris Id`
    },
    uiMapCode: {
      sql: `${CUBE}.\`uiMapCode\``,
      type: `string`,
      title: `UI MAP CODE`
    },
    jurisId: {
      sql: `${CUBE}.\`jurisId\``,
      type: `string`,
      title: `Juris Id`
    },
    tenantId: {
      sql: `${CUBE}.\`tenantId\``,
      type: `string`
    },
    shortName: {
      sql: `${CUBE}.\`shortName\``,
      type: `string`,
      title: `Short Name`
    },
    displayName: {
      sql: `${CUBE}.\`displayName\``,
      type: `string`,
      primaryKey: true,
      shown: true,
      title: `Display Name`
    },
    order: {
      sql: `${CUBE}.\`orderNumber\``,
      type: `string`,
      title: `Order`
    }
  },

  dataSource: `default`
});
