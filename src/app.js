const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'VorTech Usuario Microservice',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido al microservicio VorTech Usuario',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      register: 'POST /api/users/register',
      login: 'POST /api/users/login',
      profile: 'GET /api/users/profile',
      getUser: 'GET /api/users/:id',
      updateUser: 'PUT /api/users/:id',
      deleteUser: 'DELETE /api/users/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'No encontrado',
    mensaje: 'El endpoint solicitado no existe'
  });
});

module.exports = app;
