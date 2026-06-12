import { Types } from 'mongoose';
import { TaskRepository } from '../repositories/task.repository.js';

const repo = new TaskRepository();

function normalizeTitle(title: string) {
  return title.trim().toLowerCase().replace(/\s+/g, '-');
}

function ensureValidTaskId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID da tarefa invalido');
  }
}

export async function createTask(taskData: any) {
  if (!taskData.title || typeof taskData.title !== 'string') {
    throw new Error('Titulo e obrigatorio');
  }

  if (!taskData.description || typeof taskData.description !== 'string') {
    throw new Error('Descricao e obrigatoria');
  }

  const titleNormalized = normalizeTitle(taskData.title);
  const existing = await repo.normalizeTitle(titleNormalized);
  if (existing) {
    throw new Error('Titulo ja existe');
  }

  taskData.titleNormalized = titleNormalized;
  return await repo.createTask(taskData);
}

export async function listTasks(userId: string, filters: any = {}) {
  return await repo.getTasksByUserId(userId, filters);
}

export async function getTaskById(id: string, userId?: string) {
  ensureValidTaskId(id);
  return await repo.getTaskById(id, userId);
}

export async function updateTask(id: string, updateData: any, userId?: string) {
  ensureValidTaskId(id);

  const task = await repo.getTaskById(id, userId);

  if (!task) {
    throw new Error('Tarefa nao encontrada');
  }

  if (task.isDeleted) {
    throw new Error('Tarefa deletada');
  }

  if (updateData.title) {
    const titleNormalized = normalizeTitle(updateData.title);
    const existing = await repo.normalizeTitle(titleNormalized);

    if (existing && existing._id.toString() !== id) {
      throw new Error('Titulo ja existe');
    }

    updateData.titleNormalized = titleNormalized;
  }

  if (updateData.dueDate) {
    const newDueDate = new Date(updateData.dueDate);
    if (Number.isNaN(newDueDate.getTime())) {
      throw new Error('dueDate invalido');
    }

    const currentDueDate = task.dueDate ? new Date(task.dueDate) : null;
    const dueDateChanged =
      !currentDueDate || currentDueDate.getTime() !== newDueDate.getTime();

    if (dueDateChanged) {
      const reason = String(updateData.deadlineChangeReason || '').trim();
      if (!reason) {
        throw new Error('Motivo de alteracao de prazo e obrigatorio');
      }

      updateData.deadlineHistory = [
        ...(task.deadlineHistory || []),
        {
          oldDate: task.dueDate ?? null,
          newDate: newDueDate,
          reason,
          changedAt: new Date(),
        },
      ];

      updateData.dueDate = newDueDate;
    }

    delete updateData.deadlineChangeReason;
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
        `Transicao invalida: ${task.status} -> ${updateData.status}`
      );
    }

    if (updateData.status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    }

    if (updateData.status === 'DONE') {
      updateData.completedAt = new Date();
    }
  }

  return await repo.updateTask(id, updateData, userId);
}

export async function deleteTask(id: string, userId?: string) {
  ensureValidTaskId(id);

  const task = await repo.getTaskById(id, userId);

  if (!task) {
    throw new Error('Tarefa nao encontrada');
  }

  if (task.isDeleted) {
    throw new Error('Tarefa ja deletada');
  }

  return await repo.deleteTask(id, userId);
}
