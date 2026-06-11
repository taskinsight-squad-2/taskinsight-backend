import Task, { ITask } from '../models/task.model.js';

export const createTask = (data: Partial<ITask>) => Task.create(data);

export const findAllTasks = (userId: string) =>
  Task.find({ userId, isDeleted: false }).sort({ createdAt: -1 });

export const findTaskById = (id: string, userId?: string) => {
  const query: Record<string, unknown> = { _id: id, isDeleted: false };

  if (userId) {
    query.userId = userId;
  }

  return Task.findOne(query);
};

export const updateTask = (id: string, data: Partial<ITask>, userId?: string) => {
  const query: Record<string, unknown> = { _id: id, isDeleted: false };

  if (userId) {
    query.userId = userId;
  }

  return Task.findOneAndUpdate(query, data, { new: true });
};

export const deleteTask = (id: string, userId?: string) => {
  const query: Record<string, unknown> = { _id: id, isDeleted: false };

  if (userId) {
    query.userId = userId;
  }

  return Task.findOneAndUpdate(
    query,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};
