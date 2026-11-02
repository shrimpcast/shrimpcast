class AdminActionsManager {
  static async GetOrderedConfig(signalR) {
    const response = await signalR.invoke("GetOrderedConfig").catch((ex) => console.log(ex));
    return response;
  }
  static async SaveConfig(signalR, config, openKey) {
    if (config[openKey]) config[openKey] = new Date(config[openKey]).toISOString();
    else config[openKey] = new Date().toISOString();
    const response = await signalR.invoke("SaveConfig", config).catch((ex) => console.log(ex));
    return response;
  }
  static async GetBans(signalR) {
    const response = await signalR.invoke("ListBans").catch((ex) => console.log(ex));
    return response;
  }
  static async GetActiveMutes(signalR) {
    const response = await signalR.invoke("ListActiveMutes").catch((ex) => console.log(ex));
    return response;
  }
  static async GetActiveUsers(signalR) {
    const response = await signalR.invoke("ListActiveUsers").catch((ex) => console.log(ex));
    return response;
  }
  static async ListMods(signalR) {
    const response = await signalR.invoke("ListMods").catch((ex) => console.log(ex));
    return response;
  }
}

export default AdminActionsManager;
