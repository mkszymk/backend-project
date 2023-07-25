import { messagesModel } from "../../dao/models/message.model.js";

export default class DBMessageManager {
  async addChat(sender, message) {
    try {
      await messagesModel.create({ user: sender, message });
      return { success: true, data: { sender, message } };
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }

  async getChats() {
    try {
      let chats = await messagesModel.find();
      return chats;
    } catch (error) {
      return { error: 500, mongoError: error };
    }
  }
}
