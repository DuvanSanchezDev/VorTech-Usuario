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

// Rutas públicas
router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProfile);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, validateUpdate, handleValidationErrors, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
