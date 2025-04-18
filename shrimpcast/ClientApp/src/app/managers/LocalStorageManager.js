class LocalStorageManager {
  static localStorage = {
    token: "access_token",
    name: "name",
    ignoredUsers: "ignored_users",
    showNotificationsPrompt: "notifications_prompt_hidden",
    showGitHubPrompt: "github_prompt_hidden",
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

  static saveName(name) {
    this.setStorage(this.localStorage.name, name);
  }

  static getName() {
    return this.getStorage(this.localStorage.name);
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
    return users || [];
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
}

export default LocalStorageManager;
