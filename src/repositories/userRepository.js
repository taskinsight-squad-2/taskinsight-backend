import User from "../models/User.js";

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id);
  }
}

export default new UserRepository();