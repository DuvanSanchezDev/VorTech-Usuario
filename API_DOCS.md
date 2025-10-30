# Documentación de la API - VorTech Usuario

## Información General

- **Base URL**: `http://localhost:3000/api/users`
- **Formato de respuesta**: JSON
- **Autenticación**: JWT Bearer Token

## Códigos de respuesta HTTP

| Código | Significado |
|--------|------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 400 | Error de validación |
| 401 | No autenticado |
| 403 | Acceso denegado |
| 404 | No encontrado |
| 409 | Conflicto (recurso duplicado) |
| 500 | Error interno del servidor |

## Endpoints

### 1. Registro de usuario

Crea una nueva cuenta de usuario.

**Endpoint**: `POST /api/users/register`

**Autenticación**: No requerida

**Body**:
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+573001234567",
  "direccion": "Calle 123 #45-67"
}
```

**Campos requeridos**:
- `email`: Email válido
- `password`: Mínimo 6 caracteres
- `nombre`: Mínimo 2 caracteres
- `apellido`: Mínimo 2 caracteres

**Campos opcionales**:
- `telefono`: Número de teléfono válido
- `direccion`: Dirección de domicilio

**Respuesta exitosa (201)**:
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+573001234567",
    "direccion": "Calle 123 #45-67",
    "fechaCreacion": "2025-10-30T17:00:00.000Z",
    "activo": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles**:
- `409`: Email ya registrado
- `400`: Errores de validación

---

### 2. Login

Autentica a un usuario y retorna un token JWT.

**Endpoint**: `POST /api/users/login`

**Autenticación**: No requerida

**Body**:
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200)**:
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles**:
- `401`: Credenciales inválidas
- `400`: Errores de validación

---

### 3. Obtener perfil

Obtiene la información del usuario autenticado.

**Endpoint**: `GET /api/users/profile`

**Autenticación**: Requerida

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200)**:
```json
{
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+573001234567",
    "direccion": "Calle 123 #45-67",
    "fechaCreacion": "2025-10-30T17:00:00.000Z",
    "activo": true
  }
}
```

**Errores posibles**:
- `401`: Token no proporcionado
- `403`: Token inválido
- `404`: Usuario no encontrado

---

### 4. Obtener usuario por ID

Obtiene la información de un usuario específico.

**Endpoint**: `GET /api/users/:id`

**Autenticación**: Requerida

**Headers**:
```
Authorization: Bearer <token>
```

**Parámetros URL**:
- `id`: ID del usuario

**Nota**: Un usuario solo puede consultar su propia información.

**Respuesta exitosa (200)**:
```json
{
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

**Errores posibles**:
- `401`: Token no proporcionado
- `403`: Intento de acceder a otro usuario
- `404`: Usuario no encontrado

---

### 5. Actualizar usuario

Actualiza la información del usuario.

**Endpoint**: `PUT /api/users/:id`

**Autenticación**: Requerida

**Headers**:
```
Authorization: Bearer <token>
```

**Parámetros URL**:
- `id`: ID del usuario

**Body** (todos los campos son opcionales):
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "telefono": "+573009876543",
  "direccion": "Carrera 50 #30-20",
  "password": "newpassword123"
}
```

**Nota**: Un usuario solo puede actualizar su propia información.

**Respuesta exitosa (200)**:
```json
{
  "mensaje": "Usuario actualizado exitosamente",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "telefono": "+573009876543",
    "direccion": "Carrera 50 #30-20"
  }
}
```

**Errores posibles**:
- `400`: Errores de validación
- `401`: Token no proporcionado
- `403`: Intento de actualizar otro usuario
- `404`: Usuario no encontrado

---

### 6. Eliminar usuario

Desactiva la cuenta del usuario (eliminación lógica).

**Endpoint**: `DELETE /api/users/:id`

**Autenticación**: Requerida

**Headers**:
```
Authorization: Bearer <token>
```

**Parámetros URL**:
- `id`: ID del usuario

**Nota**: 
- Un usuario solo puede eliminar su propia cuenta
- La eliminación es lógica, no se borra físicamente el usuario

**Respuesta exitosa (200)**:
```json
{
  "mensaje": "Usuario eliminado exitosamente",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "activo": false
  }
}
```

**Errores posibles**:
- `401`: Token no proporcionado
- `403`: Intento de eliminar otro usuario
- `404`: Usuario no encontrado

---

### 7. Health Check

Verifica el estado del servicio.

**Endpoint**: `GET /health`

**Autenticación**: No requerida

**Respuesta (200)**:
```json
{
  "status": "ok",
  "service": "VorTech Usuario Microservice",
  "timestamp": "2025-10-30T17:00:00.000Z"
}
```

---

## Formato de errores

Todos los endpoints retornan errores en el siguiente formato:

```json
{
  "error": "Título del error",
  "mensaje": "Descripción detallada del error"
}
```

Para errores de validación (400):
```json
{
  "error": "Errores de validación",
  "errores": [
    {
      "msg": "El nombre debe tener al menos 2 caracteres",
      "param": "nombre",
      "location": "body"
    }
  ]
}
```

## Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT.

**Proceso**:
1. Registrar o hacer login para obtener un token
2. Incluir el token en el header `Authorization` de cada request:
   ```
   Authorization: Bearer <token>
   ```

**Duración del token**: 24 horas (configurable en `.env`)

**Nota de seguridad**: Los usuarios solo pueden acceder y modificar su propia información.

## Ejemplos con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Juan",
    "apellido": "Pérez"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Obtener perfil (con token)
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <tu-token-aqui>"
```

### Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <tu-token-aqui>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "telefono": "+573009876543"
  }'
```

## Notas adicionales

- Todas las contraseñas se almacenan encriptadas con bcrypt
- La validación de teléfono acepta formatos internacionales
- Los emails se normalizan automáticamente (lowercase)
- Las fechas se retornan en formato ISO 8601
