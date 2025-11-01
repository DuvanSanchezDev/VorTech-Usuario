from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from security.token import verificar_token_acceso
from services import eliminar_usuario as eu
from models.usuario import InformacionToken, EliminarUsuario

router = APIRouter(
    prefix="/eliminar"
    )

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#---Leer raiz de eliminar---
@router.get("/")
async def leer_eliminar():
    return {
        "mensaje" : "Ruta de eliminación activa"
    }

#--Endpoint para eliminar usuario---
@router.delete("/usuario")
async def eliminar_usuario(contrasena: EliminarUsuario, token: str = Depends(oauth2_scheme)):
    
    data_token = await verificar_token_acceso(token)
    
    respuesta = await eu.eliminar_usuario(contrasena.contrasena, data_token)
    
    return respuesta

