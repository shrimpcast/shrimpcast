class ChatActionsManager {
  static async RemoveMessage(signalR, messageId) {
    const response = await signalR.invoke("RemoveMessage", messageId).catch((ex) => console.log(ex));
    return response;
  }
  static async GetMessageInfo(signalR, messageId, sessionId, useSession) {
    const response = await signalR
      .invoke("GetInformation", messageId || 0, useSession ? sessionId : 0)
      .catch((ex) => console.log(ex));
    return response;
  }
  static async Mute(signalR, sessionId) {
    const response = await signalR.invoke("Mute", sessionId).catch((ex) => console.log(ex));
    return response;
  }
  static async ChangeColour(signalR, nameColourId) {
    const response = await signalR.invoke("ChangeColour", nameColourId).catch((ex) => console.log(ex));
    return response;
  }
  static async Ban(signalR, sessionId, isSilent, silentDelete) {
    const response = await signalR.invoke("Ban", sessionId, isSilent, silentDelete).catch((ex) => console.log(ex));
    return response;
  }
  static async Unban(signalR, banId) {
    const response = await signalR.invoke("Unban", banId).catch((ex) => console.log(ex));
    return response;
  }
  static async GetUserCount(signalR) {
    await signalR.invoke("GetUserCount").catch((ex) => console.log(ex));
  }
}

export default ChatActionsManager;
