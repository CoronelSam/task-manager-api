const bcrypt = require('bcryptjs');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');
const { jwt: jwtConfig, bcryptSaltRounds } = require('../config/env');

// Hash ficticio para igualar el tiempo de respuesta cuando el email no existe
// (evita que se pueda averiguar qué emails están registrados midiendo tiempos).
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', bcryptSaltRounds);

const register = async (req, res) => {
  const { name, email, password } = req.validated;

  const exists = await User.findOne({ where: { email } });
  if (exists) {
    throw new AppError(409, 'El email ya está registrado');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    message: 'Usuario registrado correctamente',
    user,
  });
};

const login = async (req, res) => {
  const { email, password } = req.validated;

  const user = await User.scope('withPassword').findOne({ where: { email } });
  const passwordOk = user
    ? await user.validatePassword(password)
    : await bcrypt.compare(password, DUMMY_HASH).then(() => false);

  if (!user || !passwordOk) {
    // Mensaje genérico: no revelar si falló el email o la contraseña.
    throw new AppError(401, 'Credenciales inválidas');
  }

  const token = signToken(user);

  res.json({
    message: 'Inicio de sesión exitoso',
    token,
    tokenType: 'Bearer',
    expiresIn: jwtConfig.expiresIn,
    user,
  });
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };
