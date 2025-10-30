const bcrypt = require('bcrypt');

class User {
  constructor(id, email, password, nombre, apellido, telefono = null, direccion = null) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.direccion = direccion;
    this.fechaCreacion = new Date();
    this.activo = true;
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// In-memory storage (en producción usar una base de datos real)
class UserRepository {
  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async create(userData) {
    const { email, password, nombre, apellido, telefono, direccion } = userData;
    
    // Verificar si el email ya existe
    if (this.findByEmail(email)) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User(
      this.currentId++,
      email,
      hashedPassword,
      nombre,
      apellido,
      telefono,
      direccion
    );

    this.users.set(user.id, user);
    return user;
  }

  findById(id) {
    return this.users.get(id);
  }

  findByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async update(id, updateData) {
    const user = this.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar solo campos permitidos
    const allowedFields = ['nombre', 'apellido', 'telefono', 'direccion'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    // Si se actualiza la contraseña
    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }

    return user;
  }

  delete(id) {
    const user = this.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.activo = false;
    return user;
  }

  getAll() {
    return Array.from(this.users.values()).filter(user => user.activo);
  }
}

module.exports = { User, UserRepository };
