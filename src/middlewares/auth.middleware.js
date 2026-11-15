const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Verifica el JWT enviado en el header:  Authorization: Bearer <token>
 * Si es válido, adjunta el usuario autenticado en req.user.
 */
const authenticate = async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    throw new AppError(401, 'Token no proporcionado. Usa el header Authorization: Bearer <token>');
  }

  const match = header.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    throw new AppError(401, 'Formato de token inválido. Usa: Authorization: Bearer <token>');
  }
  const token = match[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    if (err instanceof TokenExpiredError) throw new AppError(401, 'El token ha expirado');
    if (err instanceof JsonWebTokenError) throw new AppError(401, 'Token inválido');
    throw err;
  }

  // Comprobar que el usuario del token sigue existiendo.
  const user = await User.findByPk(payload.sub);
  if (!user) {
    throw new AppError(401, 'El usuario del token ya no existe');
  }

  req.user = { id: user.id, name: user.name, email: user.email };
  next();
};

module.exports = authenticate;
