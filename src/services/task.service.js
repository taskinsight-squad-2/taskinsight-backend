import * as taskRepository from "../repositories/task.repository.js";

export const createTask = async (data) => {
  // US04 — Valida se os campos obrigatórios foram preenchidos
  if (!data.title) throw new Error("Title is required");
  if (!data.description) throw new Error("Description is required");
  return taskRepository.createTask(data);
};

export const listTasks = async (userId) => {
  return taskRepository.findAllTasks(userId);
};

export const updateTask = async (id, data) => {
  // US05 — Restringe as mudanças de estado para os Enums aceitos
  if (data.status) {
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
    if (!validStatuses.includes(data.status)) {
      throw new Error("Invalid status value");
    }
  }
  return taskRepository.updateTask(id, data);
};

export const deleteTask = async (id) => {
  return taskRepository.deleteTask(id);
};