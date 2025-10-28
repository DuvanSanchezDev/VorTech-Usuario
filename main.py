from fastapi import FastAPI

app = FastAPI(
    title="Servicio Usuario",
    description="Servicio encargado de la gestión de usuarios y autenticación.",
    version="1.0.0"
)

@app.get("/")
async def leer_raiz(): 
    return {
        "mensaje" : "Servicio de usarios y autenticación activo."
    }