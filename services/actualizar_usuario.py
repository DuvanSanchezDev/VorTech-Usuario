from supabase import create_client, Client
from models.usuario import ActualizarContrasena, ActualizarCorreo, ActualizarInformacionUsuario, InformacionToken
from dotenv import load_dotenv
import os 
from security import token as tk, validaciones as val, hasheo_contrasenas as hc
from fastapi import HTTPException, Depends

#---Recuperar variables de entorno para supabase y generar conexión a la base de datos---
load_dotenv()

URL: str = os.getenv("URL")
KEY: str = os.getenv("KEY")
supabase : Client = create_client(URL, KEY)

#---Función para actualizar la contraseña del usuario---
async def actualizar_contrasena(contrasena: ActualizarContrasena, token: InformacionToken) -> dict:
    #---Traer la contraseña antigua de la base de datos---
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
    
    #---Validar la contraseña antigua---
    if not hc.comprobar_contrasena(contrasena.contrasena_vieja, contrasena_db):
        raise HTTPException(status_code=401, detail="Contraseña anterior incorrecta")
    
    #---Hashear la nueva contraseña---
    contrasena_haseada = hc.hashear_contrasena(contrasena.contrasena)
    
    #---Actualizar la contraseña en la base de datos---
    try: 
        respuesta = (
            supabase.table("usuario")
            .update({"contrasena": contrasena_haseada})
            .eq("username", token.username)
            .execute()
        )

        return {
            "mensaje": "Contraseña actualizada correctamente"
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al actualizar la contraseña del usuario.")
        
#---Función para actualizar el correo del usuario---
async def actualizar_correo(correo: ActualizarCorreo, token: InformacionToken) -> dict:
    #---Traer la contraseña antigua de la base de datos---
    try: 
        respuesta = (
            supabase.table("usuario")
            .select("*")
            .eq("username", token.username)
            .execute()
        )
        correo_db = respuesta.data[0]["correo"]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al recuperar el correo del usuario.")
    
    #---Actualizar el correo en la base de datos---
    try:    
        respuesta = (
            supabase.table("usuario")
            .update({"correo": correo.correo})
            .eq("username", token.username)
            .execute()
        )

        return {
            "mensaje": "Correo actualizado correctamente"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al actualizar el correo del usuario.")

#--Función para retornar la información del usuario actual---
async def obtener_informacion_usuario_actual(token: InformacionToken) -> ActualizarInformacionUsuario: 
    #---Obtener la información del usuario desde la base de datos---    
    respuesta = (
        supabase.table("informacion_usuario")
        .select("*")
        .eq("id", token.id)
        .execute()
    )
    
    #---Construir el modelo de información del usuario---
    data = ActualizarInformacionUsuario ( 
        nombre_completo=respuesta.data[0]["nombre_completo"],
        telefono=respuesta.data[0]["telefono"],
        direccion=respuesta.data[0]["direccion"],
        ciudad=respuesta.data[0]["ciudad"],
        barrio=respuesta.data[0]["barrio"], 
        descripcion=respuesta.data[0]["descripcion"],
        codigo_postal=respuesta.data[0]["codigo_postal"]
    )
    
    return data

#---Función para actualizar la información adicional del usuario---
async def actualizar_informacion_usuario_actual(informacion: ActualizarInformacionUsuario, token: InformacionToken) -> dict:
    #---Actualizar la información adicional del usuario en la base de datos---
    try:    
        respuesta = (
            supabase.table("informacion_usuario")
            .update({
                "nombre_completo": informacion.nombre_completo,
                "telefono": informacion.telefono,
                "direccion": informacion.direccion,
                "ciudad": informacion.ciudad,
                "barrio": informacion.barrio,
                "descripcion": informacion.descripcion,
                "codigo_postal": informacion.codigo_postal
            })
            .eq("id", token.id)
            .execute()
        )

        return {
            "mensaje": "Información del usuario actualizada correctamente"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al actualizar la información del usuario.")