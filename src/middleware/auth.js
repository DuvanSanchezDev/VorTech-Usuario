const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Acceso denegado',
      mensaje: 'Token de autenticación requerido' 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Token inválido',
      mensaje: 'El token de autenticación no es válido o ha expirado' 
    });
  }
};

module.exports = { authenticateToken };
