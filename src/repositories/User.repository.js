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
}
