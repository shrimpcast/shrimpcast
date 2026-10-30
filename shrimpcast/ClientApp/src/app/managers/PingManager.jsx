class PingManager {
  static async ConfirmPingReception(signalR, pingId, confirmSeen) {
    await signalR.invoke('ConfirmPingReception', pingId, confirmSeen).catch(ex => console.log(ex));
  }
}

export default PingManager;
