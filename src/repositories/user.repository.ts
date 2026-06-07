import User, { IUser } from "../models/user.model.js";

class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email, deletedAt: null });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findOne({ _id: id, deletedAt: null });
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { _id: id, deletedAt: null },
      userData,
      { new: true }
    );
  }

  async softDelete(id: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
  }
}

export default new UserRepository();
