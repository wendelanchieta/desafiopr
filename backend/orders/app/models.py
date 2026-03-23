from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    descricao_item = Column(String)
    quantidade = Column(Integer)
    status = Column(String, default="Pendente") # Pendente, Processando, Enviado, Entregue
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())