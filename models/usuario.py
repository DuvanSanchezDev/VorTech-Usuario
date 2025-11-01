from pydantic import BaseModel, EmailStr

###############################################################################################################################
# Registrar usuarios y su información adicional 
###############################################################################################################################

#---Modelo para registrar la información del usuario---
class RegistrarUsuario(BaseModel): 
    username : str 
    correo : EmailStr
    contrasena : str
    administrador : bool = False 
    activo : bool = True

#---Modelo para registrar la información adicional del usuario---
class RegistrarInformacionUsuario(BaseModel): 
    identificacion : str 
    nombre_completo : str
    telefono : str
    direccion : str
    ciudad : str 
    barrio : str 
    descripcion : str
    codigo_postal : str
    
###############################################################################################################################
# Autentificación y manejo de tokens
###############################################################################################################################

#---Modelo de autentición de la app---
class Autenticacion(BaseModel): 
    username : str 
    contrasena : str

#---Modelo para construir la información del token---
class InformacionToken(BaseModel):
    id : int 
    username : str 
    correo : EmailStr
    administrador : bool
    activo : bool

#---Estructura de retorno para el token---
class Token(BaseModel): 
    access_token : str 
    token_type : str

###############################################################################################################################
# Actualización de usuarios y su información adicional
###############################################################################################################################

#---Modelo para actualizar el correo del usuario---
class ActualizarCorreo(BaseModel): 
    correo : EmailStr
    
#---Modelo para actualizar la contraseña del usuario---
class ActualizarContrasena(BaseModel):
    contrasena : str 
    contrasena_confirmacion : str 
    contrasena_vieja : str

#---Modelo para actualizar la información adicional del usuario---
class ActualizarInformacionUsuario(BaseModel): 
    nombre_completo : str 
    telefono : str 
    direccion : str 
    ciudad : str 
    barrio : str 
    descripcion : str 
    codigo_postal : str

###############################################################################################################################
# Eliminar usuario
###############################################################################################################################

#---Modelo para eliminar usuario---
class EliminarUsuario(BaseModel):
    contrasena : str 
