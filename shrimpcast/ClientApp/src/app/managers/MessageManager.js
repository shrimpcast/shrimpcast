import axios from "axios";

class MessageManager {
  static async GetExistingMessages(abortSignal) {
    const response = await axios
      .get(`/api/message/GetExisting`, { signal: abortSignal })
      .catch((ex) => console.log(ex));

    return response?.data || [];
  }
  static async NewMessage(signalR, message) {
    const response = await signalR.invoke("NewMessage", message).catch((ex) => console.log(ex));
    return response;
  }
}

export default MessageManager;
