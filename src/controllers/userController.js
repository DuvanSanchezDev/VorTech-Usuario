const jwt = require('jsonwebtoken');
const { UserRepository } = require('../models/User');

const userRepository = new UserRepository();

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    },
    secret,
    { expiresIn }
  );
};

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, direccion } = req.body;

    const user = await userRepository.create({
      email,
      password,
      nombre,
      apellido,
      telefono,
      direccion
    });

    const token = generateToken(user);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: user.toJSON(),
      token
    });
  } catch (error) {
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({ 
        error: 'Conflicto',
        mensaje: error.message 
      });
    }
    res.status(500).json({ 
      error: 'Error en el servidor',
      mensaje: 'Error al registrar el usuario' 
    });
  }
};

// Autenticar usuario (login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = userRepository.findByEmail(email);

    if (!user || !user.activo) {
      return res.status(401).json({ 
        error: 'Autenticación fallida',
        mensaje: 'Credenciales inválidas' 
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Autenticación fallida',
        mensaje: 'Credenciales inválidas' 
      });
    }

    const token = generateToken(user);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error en el servidor',
      mensaje: 'Error al autenticar el usuario' 
    });
  }
};

// Obtener información de un usuario
const getUserById = (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Verificar que el usuario autenticado solo pueda ver su propia información
    if (req.user.id !== userId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        mensaje: 'No tiene permisos para acceder a esta información' 
      });
    }

    const user = userRepository.findById(userId);

    if (!user || !user.activo) {
      return res.status(404).json({ 
        error: 'No encontrado',
        mensaje: 'Usuario no encontrado' 
      });
    }

    res.json({
      usuario: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error en el servidor',
      mensaje: 'Error al obtener la información del usuario' 
    });
  }
};

// Actualizar información de un usuario
const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Verificar que el usuario autenticado solo pueda actualizar su propia información
    if (req.user.id !== userId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        mensaje: 'No tiene permisos para actualizar esta información' 
      });
    }

    const updateData = req.body;
    const user = await userRepository.update(userId, updateData);

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: user.toJSON()
    });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ 
        error: 'No encontrado',
        mensaje: error.message 
      });
    }
    res.status(500).json({ 
      error: 'Error en el servidor',
      mensaje: 'Error al actualizar el usuario' 
    });
  }
};

// Eliminar usuario (desactivar)
const deleteUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Verificar que el usuario autenticado solo pueda eliminar su propia cuenta
    if (req.user.id !== userId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        mensaje: 'No tiene permisos para eliminar esta cuenta' 
      });
    }

    const user = userRepository.delete(userId);

    res.json({
      mensaje: 'Usuario eliminado exitosamente',
      usuario: user.toJSON()
    });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ 
        error: 'No encontrado',
        mensaje: error.message 
      });
    }
    res.status(500).json({ 
      error: 'Error en el servidor',
      mensaje: 'Error al eliminar el usuario' 
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = (req, res) => {
  try {
    const user = userRepository.findById(req.user.id);

    if (!user || !user.activo) {
      return res.status(404).json({ 
        error: 'No encontrado',
        mensaje: 'Usuario no encontrado' 
      });
    }

    res.json({
      usuario: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error en el servidor',
      mensaje: 'Error al obtener el perfil' 
    });
  }
};

module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  userRepository // Exportar para usar en tests
};
