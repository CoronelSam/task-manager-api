const { UniqueConstraintError, ValidationError } = require('sequelize');
const AppError = require('../utils/AppError');
const { nodeEnv } = require('../config/env');

const notFound = (req, _res, next) => {
  next(new AppError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message, ...(err.errors && { errors: err.errors }) });
  }

  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ message: 'El recurso ya existe', errors: err.errors.map((e) => ({ field: e.path, message: e.message })) });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ message: 'Error de validación', errors: err.errors.map((e) => ({ field: e.path, message: e.message })) });
  }

  console.error(err);
  return res.status(500).json({
    message: 'Error interno del servidor',
    ...(nodeEnv === 'development' && { detail: err.message }),
  });
};

module.exports = { notFound, errorHandler };
