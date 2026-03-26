from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

#Mock do Token para não precisar bater no banco real de usuários
MOCK_TOKEN = "Bearer token_jwt"

def test_listar_pedidos_sem_token():
    response = client.get("/api/orders/")
    # Garante que a rota é protegida
    assert response.status_code == 401

def test_criar_pedido_sucesso():
    payload = {"descricao_item": "Teclado Mecânico"} 
    headers = {"Authorization": MOCK_TOKEN}
    
    response = client.post("/api/orders/", json=payload, headers=headers)
    
    assert response.status_code == 200
    assert response.json()["descricao_item"] == "Teclado Mecânico"

def test_criar_pedido_erro_422_campo_invalido():
    #Testando enviando campo com nome errado
    payload = {"nome_errado": "Teste"} 
    headers = {"Authorization": MOCK_TOKEN}
    
    response = client.post("/api/orders/", json=payload, headers=headers)
    
    assert response.status_code == 422 # O FastAPI deve rejeitar