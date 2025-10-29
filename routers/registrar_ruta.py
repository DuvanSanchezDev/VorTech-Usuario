from fastapi import APIRouter
from models.usuario import RegistrarUsuario, RegistrarInformacionUsuario
from services.registrar_usuario import registrar_usuario_supabase, registrar_informacion_usuario_supabase

router = APIRouter(
    prefix="/registrar", 
)

##############################################################################################################################
# Leer raiz de la ruta
##############################################################################################################################

@router.get("/")
async def leer_registrar(): 
    return {
        "mensaje" : "Ruta de registro de usuarios activa"
    }

##############################################################################################################################
# Endpoints
##############################################################################################################################
@router.post("/usuario", status_code=201)
async def registrar_usuario(usuario : RegistrarUsuario): 
    """
        Endpoint encargado de recibir la información en formato JSON para registrar un nuevo usuario
        
        - Responde al modelo RegistrarUsuario
        - Código de estado 201: Recurso creado exitosamente
    """
    respuesta = await registrar_usuario_supabase(usuario)
    return respuesta

@router.post("/usuario/informacion", status_code=201)
async def registrar_informacion_usuario(informacion_usuario : RegistrarInformacionUsuario):
    """
        Endpoint encargado de recibir la información en formato JSON para registrar información adicional del usuario
        
        - Responde al modelo RegistrarInformacionUsuario
        - Código de estado 201: Recurso creado exitosamente
    """
    respuesta = await registrar_informacion_usuario_supabase(informacion_usuario)
    return respuesta