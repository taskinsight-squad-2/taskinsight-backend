import * as taskService from "../services/task.service.js";

export const create = async (req, res) => {
  try {
    const task = await taskService.createTask({
      ...req.body,
      userId: req.user?.id,
    });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const list = async (req, res) => {
  try {
    const tasks = await taskService.listTasks(req.user.id);
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);
    return res.status(200).json({ message: "Task removida com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};