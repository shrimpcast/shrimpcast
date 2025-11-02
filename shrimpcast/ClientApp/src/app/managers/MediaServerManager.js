import axios from "axios";
import LocalStorageManager from "./LocalStorageManager";

class MediaServerManager {
  static async GetSystemStats(abortControllerSignal) {
    const response = await axios
      .get(`/api/mediaserver/GetSystemStats?sessionToken=${LocalStorageManager.getToken()}`, {
        signal: abortControllerSignal,
        timeout: 10000,
      })
      .catch((ex) => console.log(ex));
    return response?.data;
  }
  static async GetStreamStats(abortControllerSignal) {
    const response = await axios
      .get(`/api/mediaserver/GetStreamStats?sessionToken=${LocalStorageManager.getToken()}`, {
        signal: abortControllerSignal,
        timeout: 10000,
      })
      .catch((ex) => console.log(ex));
    return response?.data;
  }
  static async GetStreamLogs(stream) {
    stream = stream === "_server_" ? "" : stream;
    const response = await axios
      .get(`/api/mediaserver/GetStreamLogs?sessionToken=${LocalStorageManager.getToken()}&name=${stream}`, {
        timeout: 10000,
      })
      .catch((ex) => console.log(ex));
    return response?.data;
  }
  static async Add(signalR, mediaServerStream) {
    const response = await signalR.invoke("AddMediaServerStream", mediaServerStream).catch((ex) => console.log(ex));
    return response;
  }
  static async Remove(signalR, mediaServerStream) {
    const response = await signalR
      .invoke("RemoveMediaServerStream", mediaServerStream.mediaServerStreamId)
      .catch((ex) => console.log(ex));
    return response;
  }
  static async GetAll(signalR) {
    const response = await signalR.invoke("GetAllMediaServerStreams").catch((ex) => console.log(ex));
    return response;
  }
  static async Edit(signalR, mediaServerStream, extraEditObjects) {
    const response = await signalR
      .invoke("EditMediaServerStream", { ...mediaServerStream, ...extraEditObjects })
      .catch((ex) => console.log(ex));
    return response;
  }
  static async Probe(url, headers) {
    let formData = new FormData();
    formData.append("URL", url);
    formData.append("CustomHeaders", `${headers.map((h) => `${h.header}:${h.value}`).join("\r\n")}\r\n`);
    formData.append("SessionToken", LocalStorageManager.getToken());
    const response = await axios
      .post(`/api/mediaserver/Probe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 25000,
      })
      .catch((ex) => console.log(ex));
    return response?.data;
  }
  static async AddEndpoint(signalR, endpoint) {
    const response = await signalR.invoke("AddRTMPEndpoint", endpoint).catch((ex) => console.log(ex));
    return response;
  }
  static async RemoveEndpoint(signalR, endpoint) {
    const response = await signalR.invoke("RemoveRTMPEndpoint", endpoint.rtmpEndpointId).catch((ex) => console.log(ex));
    return response;
  }
  static async GetAllEndpoints(signalR) {
    const response = await signalR.invoke("GetAllRTMPEndpoints").catch((ex) => console.log(ex));
    return response;
  }
  static async EditEndpoint(signalR, endpoint) {
    const response = await signalR.invoke("EditRTMPEndpoint", endpoint).catch((ex) => console.log(ex));
    return response;
  }
}

export default MediaServerManager;
