import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """Fixture para o cliente de testes do FastAPI."""
    # O uso do 'with' garante que eventos de startup/shutdown do app sejam executados
    with TestClient(app) as c:
        yield c

@pytest.fixture
def auth_headers():
    """Fixture que retorna os headers de autenticação mockados."""
    return {"Authorization": "Bearer token_jwt"}

def test_listar_pedidos_sem_token(client):
    """Garante que a rota de listagem é protegida contra acessos não autenticados."""
    response = client.get("/api/orders/")
    assert response.status_code == 401

def test_criar_pedido_sucesso(client, auth_headers):
    """Testa a criação bem-sucedida de um pedido."""
    payload = {"descricao_item": "Teclado Mecânico"}
    
    response = client.post("/api/orders/", json=payload, headers=auth_headers)
    
    # Nota: Verifique se a sua API não deveria retornar 201 (Created) em vez de 200
    assert response.status_code == 200
    
    data = response.json()
    # Verificação mais robusta para evitar KeyError se a chave não existir
    assert "descricao_item" in data
    assert data["descricao_item"] == "Teclado Mecânico"

def test_criar_pedido_erro_422_campo_invalido(client, auth_headers):
    """Testa o envio de um payload com campos incorretos (validação do Pydantic)."""
    payload = {"nome_errado": "Teste"}
    
    response = client.post("/api/orders/", json=payload, headers=auth_headers)
    
    assert response.status_code == 422  # O FastAPI deve rejeitar automaticamente
