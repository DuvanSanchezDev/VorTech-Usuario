from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from models.usuario import ActualizarContrasena, ActualizarCorreo, ActualizarInformacionUsuario
from services import actualizar_usuario as au
from security.token import verificar_token_acceso

router = APIRouter(
    prefix="/actualizar"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#---Leer raiz de actualizar---
@router.get("/")
async def leer_actualizar():
    return {
        "mensaje" : "Ruta de actualización activa"
    }

#--Endpoint para actualizar la contraseña---
@router.put("/contrasena")
async def actualizar_contrasena(contrasena: ActualizarContrasena, token: str = Depends(oauth2_scheme)):
    data_token = await verificar_token_acceso(token)
    # Validar que las contraseñas sean la misma 
    if contrasena.contrasena != contrasena.contrasena_confirmacion:
        raise HTTPException(status_code=400, detail="La nueva contraseña y su confirmación no coinciden")

    respuesta = await au.actualizar_contrasena(contrasena, data_token)

    return respuesta

#--Endpoint para actualizar el correo---
@router.put("/correo")
async def actualizar_correo(correo: ActualizarCorreo, token: str = Depends(oauth2_scheme)):
    data_token = await verificar_token_acceso(token)

    respuesta = await au.actualizar_correo(correo, data_token)

    return respuesta

#---Endpoint para obtener la información adicional del usuario---
@router.get("/informacion")
async def leer_informacion_usuario(token: str = Depends(oauth2_scheme)):
    data_token = await verificar_token_acceso(token)

    respuesta = await au.obtener_informacion_usuario_actual(data_token)

    return respuesta

#---Endpoint para actualizar la información adicional del usuario---
@router.put("/informacion/actualizar")
async def actualizar_informacion_usuario(informacion: ActualizarInformacionUsuario, token: str = Depends(oauth2_scheme)):
    data_token = await verificar_token_acceso(token)

    respuesta = await au.actualizar_informacion_usuario_actual(informacion, data_token)

    return respuesta
