from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import orders
from app.database import engine, Base


app = FastAPI(
    title="Serviço de Pedidos - Desafio PR",
    description="API para gestão de pedidos",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria as tabelas no banco de dados se não existirem
Base.metadata.create_all(bind=engine)

# Inclui as rotas do módulo de pedidos
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])

@app.get("/")
def health_check():
    return {"status": "online", "service": "orders-service"}