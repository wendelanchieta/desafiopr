from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
from .database import engine, Base

app = FastAPI(title="Serviço de Usuários - Auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def health():
    return {"status": "active", "service": "users-service"}

@app.get("/api/orders/")
def read_orders():
    return [
        {"id": 1, "descricao_item": "Notebook Gamer", "status": "Concluído"},
        {"id": 2, "descricao_item": "Monitor 4K", "status": "Pendente"}
    ]  