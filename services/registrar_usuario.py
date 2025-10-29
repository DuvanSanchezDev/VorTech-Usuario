from fastapi import HTTPException
from models.usuario import RegistrarUsuario, RegistrarInformacionUsuario
from security import hasheo_contrasenas
import os
from supabase import client, create_client
from dotenv import load_dotenv

##############################################################################################################################
# Recuperar variables de entorno para supabase y generar conexión a la base de datos
##############################################################################################################################
load_dotenv()

URL: str = os.getenv("URL")
KEY: str = os.getenv("KEY")
supabase : client = create_client(URL, KEY)

##############################################################################################################################
# Registrar usuario e información adicional del usuario
##############################################################################################################################

async def registrar_usuario_supabase(usuario: RegistrarUsuario) -> dict: 
    """
    Función para registrar un nuevo usuario en la base de datos Supabase.
    
    Parámetros:
    - usuario: Instancia del modelo RegistrarUsuario que contiene la información del usuario a registrar.
    
    Retorna:
    - dict: Diccionario con el mensaje de éxito y el ID del usuario registrado.
    
    Raises:
    - HTTPException: Si ocurre un error durante el proceso de registro.
    """
    
    # Generar el hasheo de la contraseña 
    try:
        contrasena_hasheada = hasheo_contrasenas.hashear_contrasena(usuario.contrasena) 
    except AttributeError:
        raise HTTPException(status_code=500, detail="Error en el módulo de hasheo de contraseñas.")

    # Crear el nuevo usuario con la contraseña hasheada
    nuevo_usuario = {
        "username" : usuario.username,
        "correo" : usuario.correo,
        "contrasena" : contrasena_hasheada,
        "administrador" : usuario.administrador,
        "activo" : usuario.activo
    }
    
    # Insertar el nuevo usuario en la base de datos    
    try:    
        respuesta = (
            supabase.table("usuario").
            insert(nuevo_usuario).
            execute()
        )
        id_usuario = respuesta.data[0]["id"]
        return {
            "mensaje" : "Usuario registrado exitosamente",
            "id del usuario" : id_usuario
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error del servidor: {str(e)}")

async def registrar_informacion_usuario_supabase(informacion_usuario: RegistrarInformacionUsuario) -> dict:
    """
    Función para registrar información adicional del usuario en la base de datos Supabase.
    
    Parámetros:
    - informacion_usuario: Instancia del modelo RegistrarInformacionUsuario que contiene la información adicional del usuario a registrar.
    
    Retorna:
    - dict: Diccionario con el mensaje de éxito y el ID del usuario registrado.
    
    Raises:
    - HTTPException: Si ocurre un error durante el proceso de registro.
    """

    informacion_dict = informacion_usuario.model_dump() 
 
    # Registrar la información adicional del usuario en la base de datos
    try:    
        respuesta = (
            supabase.table("informacion_usuario").
            insert(informacion_dict).
            execute()
        )
        
        id_usuario = respuesta.data[0]["id"]
        
        return {
            "mensaje" : "Información adicional del usuario registrada existosamente",
            "id información adicional" : id_usuario
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error del servidor: {str(e)}")
