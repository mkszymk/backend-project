export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async createUser(user) {
    return await this.dao.createUser(user);
  }
  async addDocument(userId, documentName, documentLink) {
    return await this.dao.addDocument(userId, documentName, documentLink);
  }

  async changeRole(userId) {
    return await this.dao.changeRole(userId);
  }

  async getUsers() {
    return await this.dao.getUsers();
  }

  async deleteUsers() {
    return await this.dao.deleteUsers();
  }

  async getUserById(userId) {
    return await this.dao.getUserById(userId);
  }
  async deleteUserById(userId) {
    return await this.dao.deleteUserById(userId);
  }

  async getUserByEmail(userEmail) {
    return await this.dao.getUserByEmail(userEmail);
  }
}
