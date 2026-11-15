const { Router } = require('express');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  listTasksRules,
  taskIdRules,
  createTaskRules,
  updateTaskRules,
} = require('../validators/task.validators');
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

const router = Router();

// Todas las rutas de tareas requieren un JWT válido.
router.use(authenticate);

router.get('/', validate(listTasksRules), listTasks);
router.post('/', validate(createTaskRules), createTask);
router.get('/:id', validate(taskIdRules), getTask);
router.put('/:id', validate(updateTaskRules), updateTask);
router.delete('/:id', validate(taskIdRules), deleteTask);

module.exports = router;
