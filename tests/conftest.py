import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient # Adicionado: Importação de TestClient

# --- Mocking database connection and table creation during import ---
# We need to mock create_engine and Base.metadata.create_all *before*
# importing the application's main modules, as they execute these on import.

# Mock engine for in-memory SQLite
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
TEST_ENGINE = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Mock SessionLocal
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=TEST_ENGINE)

# Patch create_engine in the application's database modules
# This needs to be done for each database.py that creates an engine
# Assuming the structure is backend.users.app.database and backend.orders.app.database
@pytest.fixture(scope="session", autouse=True)
def mock_db_engine():
    # Correção da sintaxe para múltiplos patch contexts
    with patch('backend.users.app.database.create_engine', return_value=TEST_ENGINE): # type: ignore
        with patch('backend.orders.app.database.create_engine', return_value=TEST_ENGINE): # type: ignore
            yield

# Patch Base.metadata.create_all to do nothing on import
# This needs to be done for each Base.metadata.create_all call on import
@pytest.fixture(scope="session", autouse=True)
def mock_create_all():
    # Correção da sintaxe para múltiplos patch contexts
    with patch('backend.users.app.database.Base.metadata.create_all'): # type: ignore
        with patch('backend.orders.app.database.Base.metadata.create_all'): # type: ignore
            yield

# Now import the application modules after patching
# The order of imports here is crucial: first patch, then import.
from backend.users.app.database import Base as UsersBase, get_db as get_users_db
from backend.orders.app.database import Base as OrdersBase, get_db as get_orders_db

from backend.users.app.main import app as users_app
from backend.orders.app.main import app as orders_app


@pytest.fixture(name="session")
def session_fixture():
    # Create tables in the in-memory SQLite database for each Base
    UsersBase.metadata.create_all(bind=TEST_ENGINE)
    OrdersBase.metadata.create_all(bind=TEST_ENGINE)
    
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Clean up the in-memory database after each test
        UsersBase.metadata.drop_all(bind=TEST_ENGINE)
        OrdersBase.metadata.drop_all(bind=TEST_ENGINE)


@pytest.fixture(name="client")
def client_fixture(session):
    # Override the get_db dependency to use the test session
    def override_get_db():
        try:
            yield session
        finally:
            session.close()

    # For the users module
    users_app.dependency_overrides[get_users_db] = override_get_db
    # For the orders module
    orders_app.dependency_overrides[get_orders_db] = override_get_db

    with TestClient(users_app) as users_client:
        with TestClient(orders_app) as orders_client:
            # Retorna um dicionário ou tupla de clientes se ambos forem necessários
            # Ou ajuste para retornar apenas um se os testes forem separados
            yield {"users": users_client, "orders": orders_client}

    # Clear overrides after tests
    users_app.dependency_overrides.clear()
    orders_app.dependency_overrides.clear()


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
