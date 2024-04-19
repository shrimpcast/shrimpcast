class AdminActionsManager {
  static async GetOrderedConfig(signalR) {
    const response = await signalR.invoke("GetOrderedConfig").catch((ex) => console.log(ex));
    return response;
  }
  static async SaveConfig(signalR, config, openKey) {
    config[openKey] = new Date(config[openKey]).toISOString();
    const response = await signalR.invoke("SaveConfig", config).catch((ex) => console.log(ex));
    return response;
  }
  static async GetBans(signalR) {
    const response = await signalR.invoke("ListBans").catch((ex) => console.log(ex));
    return response;
  }
  static async GetActiveUsers(signalR) {
    const response = await signalR.invoke("ListActiveUsers").catch((ex) => console.log(ex));
    return response;
  }
}

export default AdminActionsManager;
