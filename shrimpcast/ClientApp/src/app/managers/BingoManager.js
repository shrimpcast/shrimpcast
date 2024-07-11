class BingoManager {
  static async NewOption(signalR, content) {
    const response = await signalR.invoke("AddBingoOption", content).catch((ex) => console.log(ex));
    return response;
  }
  static async RemoveOption(signalR, option) {
    const response = await signalR.invoke("RemoveBingoOption", option).catch((ex) => console.log(ex));
    return response;
  }
  static async ToggleOptionStatus(signalR, option) {
    const response = await signalR.invoke("ToggleBingoOptionStatus", option).catch((ex) => console.log(ex));
    return response;
  }
  static async GetOptions(signalR) {
    const response = await signalR.invoke("GetAll").catch((ex) => console.log(ex));
    return response;
  }
}

export default BingoManager;
