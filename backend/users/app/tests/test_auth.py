from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_sucesso():
    #Simulando um usuário que já existe no seu banco de teste
    payload = {"username": "admin", "password": "123"} 
    response = client.post("/api/auth/login", json=payload)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    #Verifica se o token é do tipo bearer
    assert response.json()["token_type"] == "bearer"

def test_login_senha_incorreta():
    payload = {"username": "admin", "password": "errada_password"}
    response = client.post("/api/auth/login", json=payload)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Usuário ou senha incorretos"