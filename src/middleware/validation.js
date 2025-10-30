const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres'),
  body('telefono')
    .optional()
    .isMobilePhone('any')
    .withMessage('Debe proporcionar un número de teléfono válido'),
  body('direccion')
    .optional()
    .trim()
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

const validateUpdate = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres'),
  body('telefono')
    .optional()
    .isMobilePhone('any')
    .withMessage('Debe proporcionar un número de teléfono válido'),
  body('direccion')
    .optional()
    .trim(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Errores de validación',
      errores: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateUpdate,
  handleValidationErrors
};
