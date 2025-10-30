# VorTech-Usuario

Microservicio de gestión de usuarios para la aplicación VorTech. Este servicio se encarga de:
- ✅ Registrar nuevos usuarios
- ✅ Autenticar usuarios (login)
- ✅ Manipular información de usuarios

## 🚀 Características

- **Registro de usuarios**: Permite crear nuevas cuentas con validación de datos
- **Autenticación**: Sistema de login con JWT (JSON Web Tokens)
- **Gestión de perfil**: Consultar y actualizar información del usuario
- **Seguridad**: Contraseñas encriptadas con bcrypt
- **Validación**: Validación robusta de entradas con express-validator
- **API RESTful**: Endpoints bien estructurados y documentados

## 📋 Requisitos previos

- Node.js >= 14.0.0
- npm >= 6.0.0

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/DuvanSanchezDev/VorTech-Usuario.git
cd VorTech-Usuario
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo de configuración `.env`:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus configuraciones:
```env
PORT=3000
JWT_SECRET=tu-clave-secreta-aqui
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

## 🚀 Uso

### Modo desarrollo (con hot-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 🧪 Tests

Ejecutar todos los tests:
```bash
npm test
```

Ejecutar tests con watch mode:
```bash
npm run test:watch
```

## 📚 API Endpoints

### Endpoints públicos (no requieren autenticación)

#### Registro de usuario
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+573001234567",  // Opcional
  "direccion": "Calle 123 #45-67"  // Opcional
}
```

**Respuesta exitosa (201):**
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

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
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

### Endpoints protegidos (requieren autenticación)

Para los siguientes endpoints, incluir el token en el header:
```
Authorization: Bearer <token>
```

#### Obtener perfil
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Obtener usuario por ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Actualizar usuario
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "telefono": "+573009876543",
  "direccion": "Carrera 50 #30-20",
  "password": "newpassword123"  // Opcional
}
```

#### Eliminar usuario
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

**Nota:** La eliminación es lógica (desactivación), no física.

### Health Check
```http
GET /health
```

## 🏗️ Estructura del proyecto

```
VorTech-Usuario/
├── src/
│   ├── config/           # Configuraciones
│   ├── controllers/      # Controladores de la lógica de negocio
│   ├── middleware/       # Middleware personalizados
│   ├── models/           # Modelos de datos
│   ├── routes/           # Definición de rutas
│   ├── utils/            # Utilidades
│   ├── app.js            # Configuración de Express
│   └── index.js          # Punto de entrada
├── tests/                # Tests
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore
├── jest.config.js        # Configuración de Jest
├── package.json
└── README.md
```

## 🔒 Seguridad

- Las contraseñas se almacenan encriptadas usando bcrypt
- Autenticación basada en JWT
- Validación de entradas para prevenir inyecciones
- Los usuarios solo pueden acceder y modificar su propia información
- CORS habilitado para controlar accesos

## 🛡️ Validaciones

El servicio valida:
- **Email**: Formato válido de email
- **Contraseña**: Mínimo 6 caracteres
- **Nombre y Apellido**: Mínimo 2 caracteres cada uno
- **Teléfono**: Formato válido de número telefónico (opcional)

## 📝 Notas técnicas

- **Almacenamiento**: Actualmente usa almacenamiento en memoria. Para producción, se debe integrar una base de datos (MongoDB, PostgreSQL, etc.)
- **JWT**: Los tokens expiran según la configuración en `JWT_EXPIRES_IN` (por defecto 24h)
- **Eliminación**: La eliminación de usuarios es lógica (campo `activo: false`), no se borran físicamente

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

Duvan Sánchez

## 🐛 Reporte de bugs

Si encuentras algún bug, por favor abre un issue en el repositorio de GitHub.