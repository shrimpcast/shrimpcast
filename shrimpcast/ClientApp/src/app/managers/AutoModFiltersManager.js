class AutoModFiltersManager {
  static async Add(signalR, sessionId, messageId) {
    const response = await signalR.invoke("AddAutoModFilter", sessionId, messageId).catch((ex) => console.log(ex));
    return response;
  }
  static async AddWithText(signalR, filter) {
    const response = await signalR
      .invoke("AddAutoModFilterWithText", filter.content, filter.ignoreCase, filter.ignoreDiacritic)
      .catch((ex) => console.log(ex));
    return response;
  }
  static async Remove(signalR, autoModFilter) {
    const response = await signalR
      .invoke("RemoveAutoModFilter", autoModFilter.autoModFilterId)
      .catch((ex) => console.log(ex));
    return response;
  }
  static async GetAll(signalR) {
    const response = await signalR.invoke("GetAllAutoModFilters").catch((ex) => console.log(ex));
    return response;
  }
  static async Edit(signalR, autoModFilter) {
    const response = await signalR.invoke("EditAutoModFilter", autoModFilter).catch((ex) => console.log(ex));
    return response;
  }
}

export default AutoModFiltersManager;
