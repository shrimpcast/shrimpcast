import axios from "axios";
import LocalStorageManager from "./LocalStorageManager";

class TokenManager {
  static async EnsureTokenExists(abortSignal, location) {
    let url = `/api/session/GetNewOrExisting?accessToken=${LocalStorageManager.getToken()}&version=${
      process.env.REACT_APP_VERSION
    }`;
    const params = new URLSearchParams(location.search);
    const turnstileToken = params.get("TT");
    if (turnstileToken) {
      url += "&turnstileToken=" + turnstileToken;
      console.log("TT: " + turnstileToken);
    }
    let response = await axios.get(url, { signal: abortSignal }).catch((ex) => {
      if (!abortSignal?.aborted) {
        if (ex.message.includes("Request failed with status code 403")) {
          ex.message = "likely a CDN-related issue. Please try a hard refresh (Ctrl + F5)";
          setTimeout(() => window.location.reload(true), 1000);
        }
        return { data: { message: `Could not load the site: ${ex.message}. Refresh to try again.` } };
      }
    });
    this.SaveData(response?.data?.sessionToken, response?.data?.name);
    return response?.data;
  }

  static async ChangeName(signalR, name) {
    const response = await signalR.invoke("ChangeName", name).catch((ex) => console.log(ex));
    return response;
  }

  static async Import(signalR, accessToken) {
    const response = await signalR.invoke("ImportToken", accessToken).catch((ex) => console.log(ex));
    if (response) {
      TokenManager.SaveData(accessToken, null);
      setTimeout(() => window.location.reload(), 100);
    }
    return response;
  }

  static async BeginGoldenPassPurchase(signalR, isCrypto) {
    const response = await signalR.invoke("BeginPurchase", isCrypto).catch((ex) => console.log(ex));
    return response;
  }

  static async GetSessionInvoices(signalR) {
    const response = await signalR.invoke("GetSessionInvoices").catch((ex) => console.log(ex));
    return response || [];
  }

  static async SaveData(token, name) {
    token && LocalStorageManager.saveToken(token);
    name && LocalStorageManager.saveName(name);
  }
}

export default TokenManager;
