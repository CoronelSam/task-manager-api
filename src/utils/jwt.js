const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');

const ALGORITHM = 'HS256';

const signToken = (user) =>
  jwt.sign({ sub: String(user.id), email: user.email }, jwtConfig.secret, {
    algorithm: ALGORITHM,
    expiresIn: jwtConfig.expiresIn,
  });

// Se fija el algoritmo para evitar ataques de "algorithm confusion" (p. ej. alg: none).
const verifyToken = (token) => jwt.verify(token, jwtConfig.secret, { algorithms: [ALGORITHM] });

module.exports = { signToken, verifyToken };
