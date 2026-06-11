import { Request, Response } from 'express';
import * as taskService from '../services/task.service.js';

function errorStatus(message: string) {
  if (message.includes('nao encontrada')) {
    return 404;
  }

  return 400;
}

function handleError(res: Response, err: unknown) {
  const message = err instanceof Error ? err.message : 'Erro interno';
  return res.status(errorStatus(message)).json({ error: message });
}

export const create = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask({
      ...req.body,
      userId: req.user?.id,
    });
    return res.status(201).json(task);
  } catch (err) {
    return handleError(res, err);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.listTasks(req.user!.id);
    return res.status(200).json(tasks);
  } catch (err) {
    return handleError(res, err);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user!.id
    );
    return res.status(200).json(updated);
  } catch (err) {
    return handleError(res, err);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id, req.user!.id);
    return res.status(200).json({ message: 'Task removida com sucesso' });
  } catch (err) {
    return handleError(res, err);
  }
};
