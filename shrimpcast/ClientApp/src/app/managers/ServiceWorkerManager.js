class ServiceWorkerManager {
  static urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  static arrayBufferToBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  static async getSWregistration() {
    return await navigator.serviceWorker.ready;
  }

  static async registerSWSubscription(publicVapidKey, signalR) {
    console.log("Attempting to register subscription....");
    const registration = await this.getSWregistration();
    console.log(registration);
    console.log("Registering push...");
    const options = {
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey),
    };
    const subscription = await registration.pushManager.subscribe(options);
    console.log(subscription);
    console.log("Push registered. Attempting to save...");
    const endpoint = subscription.endpoint;
    const p256 = this.arrayBufferToBase64(subscription.getKey("p256dh"));
    const auth = this.arrayBufferToBase64(subscription.getKey("auth"));
    const saved = await signalR.invoke("SubscribeToPush", endpoint, p256, auth).catch((ex) => console.log(ex));
    console.log("Push saved.");
    return saved;
  }

  static async DispatchNotifications(signalR) {
    const response = await signalR.invoke("DispatchPushNotifications").catch((ex) => console.log(ex));
    return response;
  }
}

export default ServiceWorkerManager;
