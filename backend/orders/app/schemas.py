from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrderBase(BaseModel):
    nome: str
    descricao_item: str
    quantidade: int

class OrderCreate(OrderBase):
    pass

class OrderUpdateStatus(BaseModel):
    status: str

class Order(OrderBase):
    id: int
    status: str
    data_criacao: datetime

    class Config:
        from_attributes = True