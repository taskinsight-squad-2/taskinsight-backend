import { TaskRepository } from '../repositories/task.repository.js';
import { }

const repo = new TaskRepository();

export async function createTask(taskData: any) {
  const titleNormalized = taskData.title.toLowerCase().replace(/\s+/g, '-');
  const existing = await repo.normalizeTitle(titleNormalized);
  if (existing) {
    throw new Error('Título já existe');
  }
  taskData.titleNormalized = titleNormalized;
  return await repo.createTask(taskData);
}

export async function listTasks(userId: string, filters: any = {}) {
  return await repo.getTasksByUserId(userId, filters);
}

export async function getTaskById(id: string) {
  return await repo.getTaskById(id);
}

export async function updateTask(id: string, updateData: any) {
  const task = await repo.getTaskById(id);

  if (!task) {
    throw new Error('Tarefa não encontrada');
  }

  if (task.isDeleted) {
    throw new Error('Tarefa deletada');
  }

  if (updateData.title) {
    const titleNormalized = updateData.title
      .toLowerCase()
      .replace(/\s+/g, '-');

    const existing = await repo.normalizeTitle(titleNormalized);

    if (existing && existing._id.toString() !== id) {
      throw new Error('Título já existe');
    }

    updateData.titleNormalized = titleNormalized;
  }

  if (updateData.status && updateData.status !== task.status) {
    const transitions: Record<string, string[]> = {
      PENDING: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['DONE', 'CANCELLED'],
      DONE: [],
      CANCELLED: [],
    };

    const allowed = transitions[task.status];

    if (!allowed.includes(updateData.status)) {
      throw new Error(
        `Transição inválida: ${task.status} -> ${updateData.status}`
      );
    }

    if (updateData.status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    }

    if (updateData.status === 'DONE') {
      updateData.completedAt = new Date();
    }
  }

  return await repo.updateTask(id, updateData);
}

export async function deleteTask(id: string) {
  const task = await repo.getTaskById(id);

  if (!task) {
    throw new Error('Tarefa não encontrada');
  }

  if (task.isDeleted) {
    throw new Error('Tarefa já deletada');
  }

  return await repo.deleteTask(id);
}