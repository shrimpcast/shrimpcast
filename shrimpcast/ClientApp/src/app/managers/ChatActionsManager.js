import LocalStorageManager from "./LocalStorageManager";

class ChatActionsManager {
  static public_actions = {
    ignore: "Ignore",
  };

  static mod_actions = {
    ...this.public_actions,
    mute: "Mute",
  };

  static admin_actions = {
    ...this.mod_actions,
    ban: "Ban",
    silentBan: "Silent ban",
    silentBanAndDelete: "Silent ban and delete",
    filterBan: "Filter and ban",
  };

  static actions = {
    mod: (isMod) => (isMod ? "Unmod" : "Mod"),
    verify: (isVerified) => (isVerified ? "Unverify" : "Verify"),
    ...this.admin_actions,
  };

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
  static async Unmute(signalR, sessionId) {
    const response = await signalR.invoke("Unmute", sessionId).catch((ex) => console.log(ex));
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
  static async ToggleModStatus(signalR, sessionId, shouldAdd) {
    const response = await signalR
      .invoke("ToggleModStatus", sessionId, shouldAdd || false)
      .catch((ex) => console.log(ex));
    return response;
  }
  static async ToggleVerifiedStatus(signalR, sessionId, shouldVerify) {
    const response = await signalR
      .invoke("ToggleVerifiedStatus", sessionId, shouldVerify)
      .catch((ex) => console.log(ex));
    return response;
  }
  static IsIgnored(sessionId, ignoredUsers, isAdminOrMod) {
    if (isAdminOrMod) return false;
    if (!ignoredUsers) ignoredUsers = LocalStorageManager.getIgnoredUsers();
    return Boolean(ignoredUsers.find((eu) => eu.sessionId === sessionId));
  }
  static Ignore(sessionId, sessionName) {
    let ignoredUsers = LocalStorageManager.getIgnoredUsers();
    if (this.IsIgnored(sessionId, ignoredUsers)) return true;
    ignoredUsers.push({ sessionId, n: sessionName });
    return LocalStorageManager.setIgnoredUsers(ignoredUsers);
  }
  static Unignore(signalR, sessionId) {
    let ignoredUsers = LocalStorageManager.getIgnoredUsers();
    ignoredUsers = ignoredUsers.filter((eu) => eu.sessionId !== sessionId);
    return LocalStorageManager.setIgnoredUsers(ignoredUsers);
  }
  static async SetQueryParams(signalR, source) {
    await signalR.invoke("SetQueryParams", source).catch((ex) => console.log(ex));
  }
}

export default ChatActionsManager;
