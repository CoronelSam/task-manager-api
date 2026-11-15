const { body } = require('express-validator');

const registerRules = [
  body('name')
    .exists({ values: 'falsy' }).withMessage('El nombre es obligatorio').bail()
    .isString().withMessage('El nombre debe ser texto').bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .exists({ values: 'falsy' }).withMessage('El email es obligatorio').bail()
    .isString().withMessage('El email debe ser texto').bail()
    .trim()
    .isEmail().withMessage('El email no es válido').bail()
    .isLength({ max: 150 }).withMessage('El email no puede superar 150 caracteres')
    .toLowerCase(),
  body('password')
    .exists({ values: 'falsy' }).withMessage('La contraseña es obligatoria').bail()
    .isString().withMessage('La contraseña debe ser texto').bail()
    .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres')
    .matches(/[A-Za-z]/).withMessage('La contraseña debe contener al menos una letra')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
];

const loginRules = [
  body('email')
    .exists({ values: 'falsy' }).withMessage('El email es obligatorio').bail()
    .isString().withMessage('El email debe ser texto').bail()
    .trim()
    .isEmail().withMessage('El email no es válido')
    .toLowerCase(),
  body('password')
    .exists({ values: 'falsy' }).withMessage('La contraseña es obligatoria').bail()
    .isString().withMessage('La contraseña debe ser texto'),
];

module.exports = { registerRules, loginRules };
