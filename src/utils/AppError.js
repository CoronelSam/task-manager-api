// Error operacional con código HTTP, capturado por el middleware de errores.
class AppError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
  }
}

module.exports = AppError;
