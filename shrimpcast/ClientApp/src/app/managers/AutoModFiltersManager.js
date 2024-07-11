class AutoModFiltersManager {
  static async Add(signalR, sessionId, messageId) {
    const response = await signalR.invoke("AddAutoModFilter", sessionId, messageId).catch((ex) => console.log(ex));
    return response;
  }
  static async AddWithText(signalR, content) {
    const response = await signalR.invoke("AddAutoModFilterWithText", content).catch((ex) => console.log(ex));
    return response;
  }
  static async Remove(signalR, autoModFilterId) {
    const response = await signalR.invoke("RemoveAutoModFilter", autoModFilterId).catch((ex) => console.log(ex));
    return response;
  }
  static async GetAll(signalR) {
    const response = await signalR.invoke("GetAllAutoModFilters").catch((ex) => console.log(ex));
    return response;
  }
}

export default AutoModFiltersManager;
