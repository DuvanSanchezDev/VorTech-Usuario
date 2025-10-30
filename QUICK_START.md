# Guía Rápida - VorTech Usuario Microservice

## Inicio Rápido

### 1. Instalación
```bash
git clone https://github.com/DuvanSanchezDev/VorTech-Usuario.git
cd VorTech-Usuario
npm install
cp .env.example .env
```

### 2. Configurar variables de entorno
Edita el archivo `.env` con tus configuraciones:
```env
PORT=3000
JWT_SECRET=tu-clave-secreta-muy-segura
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### 3. Iniciar el servidor
```bash
npm start        # Modo producción
npm run dev      # Modo desarrollo (con hot-reload)
```

### 4. Ejecutar tests
```bash
npm test         # Ejecutar todos los tests
npm run test:watch  # Tests en modo watch
```

## Flujo de Uso Básico

### Paso 1: Registrar un usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "mipassword123",
    "nombre": "Juan",
    "apellido": "Pérez"
  }'
```

**Respuesta:** Token JWT y datos del usuario

### Paso 2: Hacer login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "mipassword123"
  }'
```

**Respuesta:** Token JWT y datos del usuario

### Paso 3: Usar el token para acceder a recursos protegidos
```bash
# Obtener perfil
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# Actualizar perfil
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "telefono": "+573001234567"
  }'
```

## Endpoints Disponibles

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/users/register` | No | Registrar nuevo usuario |
| POST | `/api/users/login` | No | Iniciar sesión |
| GET | `/api/users/profile` | Sí | Obtener perfil del usuario |
| GET | `/api/users/:id` | Sí | Obtener usuario por ID |
| PUT | `/api/users/:id` | Sí | Actualizar usuario |
| DELETE | `/api/users/:id` | Sí | Eliminar (desactivar) usuario |
| GET | `/health` | No | Health check del servicio |

## Validaciones Importantes

### Registro de Usuario
- ✅ Email: debe ser válido
- ✅ Password: mínimo 6 caracteres
- ✅ Nombre: mínimo 2 caracteres
- ✅ Apellido: mínimo 2 caracteres
- ✅ Teléfono: formato válido (opcional)

### Seguridad
- 🔒 Rate limiting: 5 intentos de login cada 15 minutos
- 🔒 Token JWT válido por 24 horas
- 🔒 Contraseñas encriptadas con bcrypt
- 🔒 Usuarios solo pueden acceder a su propia información

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | ✅ Operación exitosa |
| 201 | ✅ Usuario creado |
| 400 | ❌ Error de validación |
| 401 | ❌ No autenticado |
| 403 | ❌ Acceso denegado |
| 404 | ❌ No encontrado |
| 409 | ❌ Email ya registrado |
| 429 | ⏱️ Límite de solicitudes excedido |
| 500 | ❌ Error del servidor |

## Ejemplos de Respuesta

### ✅ Éxito (Login)
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ❌ Error (Validación)
```json
{
  "error": "Errores de validación",
  "errores": [
    {
      "msg": "La contraseña debe tener al menos 6 caracteres",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### ⏱️ Error (Rate Limit)
```json
{
  "error": "Demasiados intentos",
  "mensaje": "Has excedido el límite de intentos. Por favor intenta de nuevo más tarde."
}
```

## Solución de Problemas

### El servidor no inicia
- Verifica que el puerto 3000 esté disponible
- Revisa que las dependencias estén instaladas (`npm install`)
- Verifica el archivo `.env`

### Los tests fallan
- Asegúrate de que NODE_ENV=test esté configurado
- Ejecuta `npm install` para instalar dependencias de desarrollo

### Rate limiting muy restrictivo en desarrollo
- Los tests configuran NODE_ENV=test automáticamente
- En desarrollo, el rate limiting es menos restrictivo
- Para producción, ajusta los valores en `src/middleware/rateLimiter.js`

## Próximos Pasos

Para llevar este microservicio a producción:

1. ✅ **Base de datos**: Reemplaza el `UserRepository` in-memory con una base de datos real (MongoDB, PostgreSQL, etc.)
2. ✅ **Variables de entorno**: Usa un JWT_SECRET fuerte y único
3. ✅ **HTTPS**: Configura SSL/TLS para comunicación segura
4. ✅ **Logs**: Implementa un sistema de logging robusto (Winston, Bunyan)
5. ✅ **Monitoreo**: Agrega herramientas de monitoreo (Prometheus, DataDog)
6. ✅ **CI/CD**: Configura pipelines de integración y despliegue continuo
7. ✅ **Docker**: Crea contenedores para fácil despliegue
8. ✅ **API Gateway**: Integra con un API Gateway para routing y load balancing

## Soporte

Para reportar bugs o solicitar features, crea un issue en el repositorio de GitHub.

---

**VorTech Usuario Microservice v1.0.0**
Desarrollado con ❤️ para la aplicación VorTech
