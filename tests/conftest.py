import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Importar as Bases e as funções get_db de cada módulo da aplicação
# Assumindo que a raiz do projeto está no PYTHONPATH, então os imports são absolutos
from backend.users.app.database import Base as UsersBase, get_db as get_users_db
from backend.orders.app.database import Base as OrdersBase, get_db as get_orders_db

from backend.users.app.main import app as users_app
from backend.orders.app.main import app as orders_app

# Configuração do banco de dados SQLite em memória para testes
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(name="session")
def session_fixture():
    # Cria as tabelas para todos os modelos definidos em UsersBase e OrdersBase
    UsersBase.metadata.create_all(bind=engine)
    OrdersBase.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Garante que o banco de dados em memória seja limpo após cada teste
        UsersBase.metadata.drop_all(bind=engine)
        OrdersBase.metadata.drop_all(bind=engine)


@pytest.fixture(name="client")
def client_fixture(session):
    # Sobrescreve a dependência get_db para usar a sessão de teste
    def override_get_db():
        try:
            yield session
        finally:
            session.close()

    # Para o módulo de usuários
    users_app.dependency_overrides[get_users_db] = override_get_db
    # Para o módulo de pedidos
    orders_app.dependency_overrides[get_orders_db] = override_get_db

    with TestClient(users_app) as users_client:
        with TestClient(orders_app) as orders_client:
            # Retorna um dicionário ou tupla de clientes se ambos forem necessários
            # Ou ajuste para retornar apenas um se os testes forem separados
            yield {"users": users_client, "orders": orders_client}

    # Limpa as sobrescritas após os testes
    users_app.dependency_overrides.clear()
    orders_app.dependency_overrides.clear()

# Se você tem testes que precisam de um cliente específico (ex: apenas o de usuários)
@pytest.fixture(name="users_client")
def users_client_fixture(session):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    users_app.dependency_overrides[get_users_db] = override_get_db
    with TestClient(users_app) as c:
        yield c
    users_app.dependency_overrides.clear()

@pytest.fixture(name="orders_client")
def orders_client_fixture(session):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    orders_app.dependency_overrides[get_orders_db] = override_get_db
    with TestClient(orders_app) as c:
        yield c
    orders_app.dependency_overrides.clear()
