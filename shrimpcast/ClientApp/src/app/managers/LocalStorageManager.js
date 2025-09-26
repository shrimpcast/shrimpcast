class LocalStorageManager {
  static localStorage = {
    token: "access_token",
    ignoredUsers: "ignored_users",
    showNotificationsPrompt: "notifications_prompt_hidden",
    showGitHubPrompt: "github_prompt_hidden",
    recentlyUsedEmotes: "recently_used_emotes",
  };

  static setStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.log("Access to storage denied.");
      window[key] = value;
    }
  }

  static getStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.log("Access to storage denied.");
      return window[key];
    }
  }

  static saveToken(token) {
    this.setStorage(this.localStorage.token, token);
  }

  static getToken() {
    return this.getStorage(this.localStorage.token);
  }

  static setIgnoredUsers(users) {
    this.setStorage(this.localStorage.ignoredUsers, JSON.stringify(users));
    return true;
  }

  static getIgnoredUsers() {
    let users;
    try {
      users = JSON.parse(this.getStorage(this.localStorage.ignoredUsers));
    } catch (e) {}
    return Array.isArray(users) ? users : [];
  }

  static hideNotificationsPrompt() {
    this.setStorage(this.localStorage.showNotificationsPrompt, true);
  }

  static shouldShowNotificationsPrompt() {
    return !Boolean(this.getStorage(this.localStorage.showNotificationsPrompt));
  }

  static hideGitHubPrompt() {
    this.setStorage(this.localStorage.showGitHubPrompt, true);
  }

  static shouldShowGitHubPrompt() {
    return !Boolean(this.getStorage(this.localStorage.showGitHubPrompt));
  }

  static setRecentlyUsedEmotes(emotes) {
    this.setStorage(this.localStorage.recentlyUsedEmotes, JSON.stringify(emotes));
    return true;
  }

  static getRecentlyUsedEmotes() {
    let emotes;
    try {
      emotes = JSON.parse(this.getStorage(this.localStorage.recentlyUsedEmotes));
    } catch (e) {}
    return Array.isArray(emotes) ? emotes : [];
  }
}

export default LocalStorageManager;
