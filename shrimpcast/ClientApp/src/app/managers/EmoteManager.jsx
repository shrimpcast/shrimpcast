import axios from "axios";
import LocalStorageManager from "./LocalStorageManager";

class EmoteManager {
  static async Add(emote, name) {
    let formData = new FormData();
    formData.append("emote", emote);
    formData.append("name", name);
    formData.append("accessToken", LocalStorageManager.getToken());
    const response = await axios
      .post("/api/emote/Add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((ex) => {
        console.log(ex);
      });
    return response?.data;
  }

  static async Remove(signalR, emoteId) {
    const response = await signalR.invoke("RemoveEmote", emoteId).catch((ex) => console.log(ex));
    return response;
  }
}

export default EmoteManager;
