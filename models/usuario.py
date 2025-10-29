from pydantic import BaseModel, EmailStr

##############################################################################################################################
# Registrar usuarios y su informacion adicional
##############################################################################################################################

class RegistrarUsuario(BaseModel): 
    username : str 
    correo : EmailStr
    contrasena : str
    administrador : bool = False 
    activo : bool = True

class RegistrarInformacionUsuario(BaseModel): 
    identificacion : str 
    nombre_completo : str
    telefono : str
    direccion : str
    ciudad : str 
    barrio : str 
    descripcion : str
    codigo_postal : str
    
##############################################################################################################################
# Oauth2 y autenticacion
##############################################################################################################################