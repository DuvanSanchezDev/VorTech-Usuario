const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getUserById,
  updateUser,
  deleteUser,
  getProfile
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validateUpdate,
  handleValidationErrors
} = require('../middleware/validation');
const { authLimiter, generalLimiter } = require('../middleware/rateLimiter');

// Rutas públicas con rate limiting estricto
router.post('/register', authLimiter, validateRegistration, handleValidationErrors, register);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, login);

// Rutas protegidas (requieren autenticación) con rate limiting general
router.get('/profile', generalLimiter, authenticateToken, getProfile);
router.get('/:id', generalLimiter, authenticateToken, getUserById);
router.put('/:id', generalLimiter, authenticateToken, validateUpdate, handleValidationErrors, updateUser);
router.delete('/:id', generalLimiter, authenticateToken, deleteUser);

module.exports = router;
