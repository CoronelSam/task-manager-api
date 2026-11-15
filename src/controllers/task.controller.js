const { Task } = require('../models');
const AppError = require('../utils/AppError');

const TASK_FIELDS = ['title', 'description', 'status'];

// Busca una tarea SOLO entre las del usuario autenticado.
// Si pertenece a otro usuario responde 404 (no se revela que existe).
const findOwnTask = async (taskId, userId) => {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) throw new AppError(404, 'Tarea no encontrada');
  return task;
};

const pick = (source, keys) =>
  Object.fromEntries(keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));

const listTasks = async (req, res) => {
  const where = { userId: req.user.id };
  if (req.validated.status) where.status = req.validated.status;

  const tasks = await Task.findAll({ where, order: [['createdAt', 'DESC'], ['id', 'DESC']] });

  res.json({ count: tasks.length, tasks });
};

const getTask = async (req, res) => {
  const task = await findOwnTask(req.validated.id, req.user.id);
  res.json({ task });
};

const createTask = async (req, res) => {
  // userId SIEMPRE sale del token, nunca del body.
  const task = await Task.create({ ...pick(req.validated, TASK_FIELDS), userId: req.user.id });
  res.status(201).json({ message: 'Tarea creada correctamente', task });
};

const updateTask = async (req, res) => {
  const task = await findOwnTask(req.validated.id, req.user.id);
  await task.update(pick(req.validated, TASK_FIELDS));
  res.json({ message: 'Tarea actualizada correctamente', task });
};

const deleteTask = async (req, res) => {
  const task = await findOwnTask(req.validated.id, req.user.id);
  await task.destroy();
  res.json({ message: 'Tarea eliminada correctamente', id: task.id });
};

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
