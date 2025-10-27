class MediaServerManager {
  static async GetSystemStats(signalR) {
    const response = await signalR.invoke("GetSystemStats").catch((ex) => console.log(ex));
    return response;
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
  static async Edit(signalR, mediaServerStream) {
    const response = await signalR.invoke("EditMediaServerStream", mediaServerStream).catch((ex) => console.log(ex));
    return response;
  }
}

export default MediaServerManager;
