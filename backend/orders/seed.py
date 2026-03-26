from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, engine # Importa sua config de banco
from app.models import Order

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_database():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Verifica se já existem dados para não duplicar na apresentação
        if db.query(Order).count() > 0:
            print("--- O banco já possui dados. Pulando seed. ---")
            return

        print("--- Populando banco de dados de Pedidos... ---")

        test_orders = [
            Order(nome="Monitor", descricao_item="Monitor Dell 27' 4K", status="Pendente", quantidade=2),
            Order(nome="Teclado", descricao_item="Teclado Mecânico Keychron K2", status="Concluído", quantidade=5),
            Order(nome="MacBook", descricao_item="MacBook Pro M3 Max (Reserva)", status="Em Processamento", quantidade=1)
        ]

        db.add_all(test_orders)
        db.commit()
        print(f"--- Sucesso! {len(test_orders)} pedidos inseridos. ---")

    except Exception as e:
        print(f"--- Erro ao inserir dados: {e} ---")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()