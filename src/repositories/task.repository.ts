import Task from '../models/task.model.js';
import { Types } from 'mongoose';

export class TaskRepository {
  async createTask(taskData: any) {
    if (taskData.title && !taskData.titleNormalized) {
      taskData.titleNormalized = taskData.title.toLowerCase().replace(/\s+/g, '-');
    }
    const task = new Task(taskData);
    return await task.save();
  }

  async getTasksByUserId(userId: string, filters: any = {}) {
    const query = { userId: new Types.ObjectId(userId), isDeleted: false, ...filters } as any;
    return await Task.find(query).sort({ createdAt: -1 });
  }

  async getTaskById(id: string) {
    return await Task.findOne({ _id: new Types.ObjectId(id), isDeleted: false });
  }

  async updateTask(id: string, updateData: any) {
    return await Task.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      updateData,
      { new: true },
    );
  }

  // softdelete
  async deleteTask(id: string) {
    return await Task.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
  }

  // titulo normalizado
  async normalizeTitle(titleNormalized: string) {
    return await Task.findOne({ titleNormalized, isDeleted: false });
  }
}
