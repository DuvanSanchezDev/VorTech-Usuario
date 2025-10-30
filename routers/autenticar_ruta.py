from fastapi import APIRouter, Depends, status, HTTPException
from models.usuario import Token, InformacionToken
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from services.autenticar_usuario import acceso, obtener_usuario_actual

router = APIRouter(
    prefix="/autenticar",   
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#---Leer raiz de autenticar---
@router.get("/")
async def leer_autenticar(): 
    return {
        "mensaje" : "Ruta de autenticación activa"
    }


@router.post("/token", status_code=200, response_model=Token)
async def autenticar_usuario(datos: OAuth2PasswordRequestForm = Depends()):
    respuesta = await acceso(datos)
    return respuesta
    
@router.get("/actual", response_model=InformacionToken)
async def leer_usuario_actual(token: str = Depends(oauth2_scheme)): 
    respuesta = await obtener_usuario_actual(token)
    return respuesta


