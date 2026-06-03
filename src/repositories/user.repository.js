import User from "../models/user.model.js";

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({ email, deletedAt: null });
  }

  async findById(id) {
    return User.findOne({ _id: id, deletedAt: null });
  }

  async softDelete(id) {
    return User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
  }
}

export default new UserRepository();