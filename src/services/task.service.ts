import { Types } from 'mongoose';
import { TaskStatus } from '../models/task.model.js';
import * as taskRepository from '../repositories/task.repository.js';

const validStatuses: TaskStatus[] = [
  'PENDING',
  'IN_PROGRESS',
  'DONE',
  'CANCELLED',
];

function ensureValidTaskId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID da tarefa invalido');
  }
}

function ensureValidUserId(userId?: string) {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error('ID do usuario invalido');
  }
}

export const createTask = async (data: any) => {
  ensureValidUserId(data.userId);

  if (!data.title) {
    throw new Error('Title is required');
  }

  if (!data.description) {
    throw new Error('Description is required');
  }

  return taskRepository.createTask(data);
};

export const listTasks = async (userId: string) => {
  ensureValidUserId(userId);
  return taskRepository.findAllTasks(userId);
};

export const updateTask = async (id: string, data: any, userId?: string) => {
  ensureValidTaskId(id);
  ensureValidUserId(userId);

  if (data.status && !validStatuses.includes(data.status)) {
    throw new Error('Invalid status value');
  }

  const task = await taskRepository.updateTask(id, data, userId);

  if (!task) {
    throw new Error('Tarefa nao encontrada');
  }

  return task;
};

export const deleteTask = async (id: string, userId?: string) => {
  ensureValidTaskId(id);
  ensureValidUserId(userId);

  const task = await taskRepository.deleteTask(id, userId);

  if (!task) {
    throw new Error('Tarefa nao encontrada');
  }

  return task;
};
