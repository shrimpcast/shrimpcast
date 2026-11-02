class PollManager {
  static async NewOption(signalR, option) {
    const response = await signalR.invoke("AddPollOption", option).catch((ex) => console.log(ex));
    return response;
  }
  static async RemoveOption(signalR, option) {
    const response = await signalR.invoke("RemovePollOption", option).catch((ex) => console.log(ex));
    return response;
  }
  static async VoteOption(signalR, option) {
    const response = await signalR.invoke("VoteOption", option).catch((ex) => console.log(ex));
    return response;
  }
  static async ShowVotes(signalR, pollOptionId) {
    const response = await signalR.invoke("GetPollVotes", pollOptionId).catch((ex) => console.log(ex));
    return response;
  }
}

export default PollManager;
