from fastapi import HTTPException
import os 
from dotenv import load_dotenv
from security.token import verificar_token_acceso
from security.hasheo_contrasenas import comprobar_contrasena
from supabase import create_client, Client
from models.usuario import InformacionToken

#---Recuperar variables de entorno para supabase y generar conexión a la base de datos---
load_dotenv()   

URL: str = os.getenv("URL")
KEY: str = os.getenv("KEY")
supabase : Client = create_client(URL, KEY)

#---Función para eliminar usuario---
async def eliminar_usuario(contrasena : str, token : InformacionToken) -> dict: 
    #---Traer la contraseña del usuario de la base de datos---
    try: 
        respuesta = (
            supabase.table("usuario")
            .select("*")
            .eq("username", token.username)
            .execute()
        )
        contrasena_db = respuesta.data[0]["contrasena"]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al recuperar la contraseña del usuario.")
    
    #---Validar la contraseña proporcionada---
    if not comprobar_contrasena(contrasena, contrasena_db):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    #---Eliminar el usuario de la base de datos---
    try: 
        respuesta = (
            supabase.table("usuario")
            .delete()
            .eq("id", token.id)
            .execute()
        )
        
        respuesta2 = (
            supabase.table("perfil_usuario")
            .delete()
            .eq("id", token.id)
            .execute()
        )

        return {
            "mensaje": "Usuario eliminado correctamente"
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al eliminar el usuario.")