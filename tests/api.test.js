const request = require('supertest');
const app = require('../src/app');

describe('VorTech Usuario Microservice', () => {
  let authToken;
  let userId;

  describe('GET /', () => {
    it('debería retornar información del servicio', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    it('debería retornar el estado del servicio', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service');
    });
  });

  describe('POST /api/users/register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+573001234567',
        direccion: 'Calle 123 #45-67'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body).toHaveProperty('usuario');
      expect(response.body).toHaveProperty('token');
      expect(response.body.usuario.email).toBe(newUser.email);
      expect(response.body.usuario).not.toHaveProperty('password');
      
      userId = response.body.usuario.id;
      authToken = response.body.token;
    });

    it('debería fallar si el email ya está registrado', async () => {
      const duplicateUser = {
        email: 'test@example.com',
        password: 'password456',
        nombre: 'María',
        apellido: 'González'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(duplicateUser);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar con validación si faltan campos requeridos', async () => {
      const invalidUser = {
        email: 'invalid@example.com',
        password: '123' // Contraseña muy corta
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errores');
    });

    it('debería fallar con validación si el email es inválido', async () => {
      const invalidUser = {
        email: 'not-an-email',
        password: 'password123',
        nombre: 'Test',
        apellido: 'User'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errores');
    });
  });

  describe('POST /api/users/login', () => {
    it('debería autenticar un usuario con credenciales válidas', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body).toHaveProperty('usuario');
      expect(response.body).toHaveProperty('token');
      expect(response.body.usuario).not.toHaveProperty('password');
    });

    it('debería fallar con credenciales inválidas', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar si el usuario no existe', async () => {
      const credentials = {
        email: 'noexiste@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar con validación si faltan campos', async () => {
      const credentials = {
        email: 'test@example.com'
        // password faltante
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errores');
    });
  });

  describe('GET /api/users/profile', () => {
    it('debería obtener el perfil del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).not.toHaveProperty('password');
      expect(response.body.usuario.email).toBe('test@example.com');
    });

    it('debería fallar sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar con token inválido', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener información de un usuario por ID', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).not.toHaveProperty('password');
      expect(response.body.usuario.id).toBe(userId);
    });

    it('debería fallar si el usuario intenta acceder a otro usuario', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar sin token de autenticación', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debería actualizar la información del usuario', async () => {
      const updateData = {
        nombre: 'Juan Carlos',
        telefono: '+573009876543',
        direccion: 'Carrera 50 #30-20'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body.usuario.nombre).toBe(updateData.nombre);
      expect(response.body.usuario.telefono).toBe(updateData.telefono);
    });

    it('debería actualizar la contraseña del usuario', async () => {
      const updateData = {
        password: 'newpassword123'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje');
    });

    it('debería fallar si el usuario intenta actualizar otro usuario', async () => {
      const updateData = {
        nombre: 'Hacker'
      };

      const response = await request(app)
        .put('/api/users/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar con validación incorrecta', async () => {
      const updateData = {
        nombre: 'A', // Muy corto
        password: '123' // Muy corta
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errores');
    });

    it('debería fallar sin token de autenticación', async () => {
      const updateData = {
        nombre: 'Juan Carlos'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debería eliminar (desactivar) la cuenta del usuario', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body.usuario.activo).toBe(false);
    });

    it('debería fallar si el usuario intenta eliminar otro usuario', async () => {
      const response = await request(app)
        .delete('/api/users/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar sin token de autenticación', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('404 Handler', () => {
    it('debería retornar 404 para rutas no existentes', async () => {
      const response = await request(app).get('/ruta-inexistente');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
