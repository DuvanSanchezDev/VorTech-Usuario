from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from models.usuario import Token, InformacionToken, Autenticacion
from supabase import create_client, Client
from dotenv import load_dotenv
from security import hasheo_contrasenas as hc, token as tk, validaciones as val
import os


#---Recuperar variables de entorno para supabase y generar conexión a la base de datos---
load_dotenv()

URL: str = os.getenv("URL")
KEY: str = os.getenv("KEY")
supabase : Client = create_client(URL, KEY)

#---Función para autenticar usuario y entregar el JWT---
async def acceso (data : OAuth2PasswordRequestForm) -> Token: 
    #---Verificar si el usuario existe---
    if not await val.existe_usuario(data.username):
        raise HTTPException(status_code=400, detail="Usuario no existente, por favor registrarse")
    
    try: 
        usuario = Autenticacion(
            username=data.username,
            contrasena=data.password
        )
    
        respuesta = (
            supabase.table("usuario")
            .select("*")
            .eq("username", usuario.username)
            .execute()
        )
        
        usuario_db = Autenticacion ( 
            username=respuesta.data[0]["username"],
            contrasena=respuesta.data[0]["contrasena"]
        )
        
        if not hc.comprobar_contrasena(usuario.contrasena, usuario_db.contrasena):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        
       #---Crear el token de acceso---
        informacion_token = InformacionToken(
            id=respuesta.data[0]["id"],
            username=respuesta.data[0]["username"],
            correo=respuesta.data[0]["correo"],
            administrador=respuesta.data[0]["administrador"],
            activo=respuesta.data[0]["activo"]
        )
        
        token_acceso = await tk.crear_token_acceso(informacion_token)
        
        return Token(
            access_token=token_acceso,
            token_type="bearer"
        )
    except JWTError:
        raise HTTPException(status_code=500, detail="Error al generar el token de acceso")

#---Función para obtener el usuario actual a partir del token de acceso---
async def obtener_usuario_actual(token: str) -> InformacionToken: 
    respuesta = await tk.verificar_token_acceso(token)
    return respuesta
    
