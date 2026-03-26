import pytest
from fastapi.testclient import TestClient
from ..backend.users.app.main import app

@pytest.fixture(scope="module")
def client():
    """Fixture para o cliente de testes do FastAPI."""
    with TestClient(app) as c:
        yield c

def test_login_sucesso(client):
    """Testa o login bem-sucedido e a geração de um token JWT."""
    payload = {"username": "admin", "password": "123"}
    response = client.post("/api/auth/login", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data.get("token_type") == "bearer"

def test_login_senha_incorreta(client):
    """Testa a falha de login com uma senha incorreta."""
    payload = {"username": "admin", "password": "errada_password"}
    response = client.post("/api/auth/login", json=payload)
    
    assert response.status_code == 401
    data = response.json()
    assert data.get("detail") == "Usuário ou senha incorretos"

@pytest.mark.parametrize("username, password", [
    ("usuario_inexistente", "qualquer_senha"),
    ("admin", None), # Testa senha nula
    (None, "123") # Testa usuário nulo
])
def test_login_entradas_invalidas(client, username, password):
    """Testa múltiplos cenários de falha de login com dados inválidos."""
    payload = {"username": username, "password": password}
    response = client.post("/api/auth/login", json=payload)
    
    # A API pode retornar 401 para credenciais inválidas ou 422 para dados malformados
    assert response.status_code in [401, 422]