const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const { registerRules, loginRules } = require('../validators/auth.validators');
const { register, login, me } = require('../controllers/auth.controller');
const { authRateLimit } = require('../config/env');

const router = Router();

// Limita intentos de registro/login para mitigar fuerza bruta.
const authLimiter = rateLimit({
  windowMs: authRateLimit.windowMs,
  limit: authRateLimit.max,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Inténtalo de nuevo más tarde.' },
});

router.post('/register', authLimiter, validate(registerRules), register);
router.post('/login', authLimiter, validate(loginRules), login);
router.get('/me', authenticate, me);

module.exports = router;
