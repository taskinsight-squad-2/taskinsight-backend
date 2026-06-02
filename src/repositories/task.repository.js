// importação do modelo de dados da tarefa
import Task from "../models/task.model.js";
//criando as funções de acesso ao banco de dados para as tarefas.
export const createTask = (data) => Task.create(data);

// Busca de tarefas por usuário, filtrando apenas os que não foram deletadas (isDeleted: false)
export const findAllTasks = (userId) => Task.find({ userId, isDeleted: false });

export const findTaskById = (id) => Task.findOne({ _id: id, isDeleted: false });

export const updateTask = (id, data) => Task.findByIdAndUpdate(id, data, { new: true });

// Deleção lógica corporativa (Soft Delete) conforme as propriedades do Model
export const deleteTask = (id) => Task.findByIdAndUpdate(
  id, 
  { isDeleted: true, deletedAt: new Date() }, 
  { new: true }
);