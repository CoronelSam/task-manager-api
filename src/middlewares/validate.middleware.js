const { validationResult, matchedData } = require('express-validator');
const AppError = require('../utils/AppError');

// Ejecuta las reglas de express-validator y deja en req.validated solo los campos permitidos.
const validate = (rules) => [
  ...rules,
  (req, _res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map(({ path, msg }) => ({ field: path || 'body', message: msg }));
      throw new AppError(400, 'Error de validación', errors);
    }
    req.validated = matchedData(req, { locations: ['body', 'params', 'query'] });
    next();
  },
];

module.exports = validate;
