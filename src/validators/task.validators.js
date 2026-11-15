const { body, param, query } = require('express-validator');
const { TASK_STATUSES } = require('../models/task');

const idParam = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt();

const titleRule = (field) =>
  field
    .isString().withMessage('El título debe ser texto').bail()
    .trim()
    .isLength({ min: 1, max: 150 }).withMessage('El título debe tener entre 1 y 150 caracteres');

// La descripción es opcional y admite null (para vaciarla en un update).
const descriptionRule = (field) =>
  field
    .optional()
    .custom((value) => value === null || typeof value === 'string')
    .withMessage('La descripción debe ser texto o null').bail()
    .customSanitizer((value) => (typeof value === 'string' ? value.trim() : value))
    .custom((value) => value === null || value.length <= 5000)
    .withMessage('La descripción no puede superar 5000 caracteres');

const statusRule = (field) =>
  field.isIn(TASK_STATUSES).withMessage(`El estado debe ser uno de: ${TASK_STATUSES.join(', ')}`);

const listTasksRules = [statusRule(query('status').optional())];

const taskIdRules = [idParam];

const createTaskRules = [
  titleRule(body('title').exists({ values: 'null' }).withMessage('El título es obligatorio').bail()),
  descriptionRule(body('description')),
  statusRule(body('status').optional()),
];

const updateTaskRules = [
  idParam,
  titleRule(body('title').optional()),
  descriptionRule(body('description')),
  statusRule(body('status').optional()),
  body().custom((value) => {
    const allowed = ['title', 'description', 'status'];
    if (!value || !allowed.some((key) => key in value)) {
      throw new Error(`Debes enviar al menos uno de estos campos: ${allowed.join(', ')}`);
    }
    return true;
  }),
];

module.exports = { listTasksRules, taskIdRules, createTaskRules, updateTaskRules };
