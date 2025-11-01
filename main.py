from fastapi import FastAPI
from routers import registrar_ruta, autenticar_ruta, actualizar_ruta, eliminar_ruta

app = FastAPI(
    title="Servicio Usuario",
    description="Servicio encargado de la gestión de usuarios y autenticación.",
    version="1.0.0"
)

##############################################################################################################################
# Incluir rutas
##############################################################################################################################
app.include_router(registrar_ruta.router)
app.include_router(autenticar_ruta.router)
app.include_router(actualizar_ruta.router)
app.include_router(eliminar_ruta.router)

@app.get("/")
async def leer_raiz(): 
    return {
        "mensaje" : "Servicio de usarios y autenticación activo."
    }