const regHubDataBase = "RegHub";

export const userCollection = getCollectionString("users");
export const tenantCollection = getCollectionString("tenants");
export const alertsCollection = getCollectionString("reg_alert_parents");
export const agencyNamesCollection =  getCollectionString("reg_alert_parents_agencyNames");
export const alertGroupIdsCollection = getCollectionString("reg_alert_parents_grpIds");
export const alertsMetaCollection =  getCollectionString("alerts_meta");
export const juridictionsCollection =  getCollectionString("reg_jurisdictions");
export const enforcementActionsCollection =  getCollectionString("reg_ea_alerts");
export const enforcementActionsAgencyNameCollection =  getCollectionString("reg_ea_alerts_agencyNames");
export const corpusCollection = getCollectionString("reg_corpus");
export const harmonizedActionCollection =  getCollectionString("reg_ea_alerts_info_harmonizedActionType");
export const regulationsCollection = getCollectionString("reg_ea_alerts_info_regulations");
export const regConfigCollection = getCollectionString("reg_config");
export const regMapStatusCollection = getCollectionString("reg_map_status");
export const risksCollection = getCollectionString("risks");
export const tasksCollection = getCollectionString("tasks");
export const controlsCollection = getCollectionString("controls");
export const risksByStatusCollection = getCollectionString("reg_config_status_risk");
export const tasksByStatusCollection = getCollectionString("reg_config_status_task");
export const controlByStatusCollection = getCollectionString("reg_config_status_control");
export const mapUserCollection = getCollectionString("reg_map_user");

function getCollectionString(collectionName){
	return `\`${regHubDataBase}\`.\`${collectionName}\``
}
