from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import redis
import json
import os

from .. import crud, models, schemas, database

router = APIRouter()

# Configuração do Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://redis-broker:6379/0")
redis_client = redis.from_url(REDIS_URL)

"""
    Salva um pedido
"""
@router.post("/", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(database.get_db)
):
    # Persiste no PostgreSQL
    new_order = crud.create_order(db=db, order=order)
    
    # Dispara tarefa assíncrona para o Redis, usando BackgroundTasks do FastAPI para não bloquear a resposta HTTP
    background_tasks.add_task(notify_priority_service, new_order.id, new_order.item_description)
    
    return new_order

"""
    Lista todas os pedidos
"""
@router.get("/", response_model=List[schemas.Order])
def read_orders(
    status: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db)
):
    return crud.get_orders(db, skip=skip, limit=limit, status=status)

"""
    Lista um pedido por Id
"""
@router.get("/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(database.get_db)):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return db_order

"""
    Retorna o status de um pedido
"""
@router.patch("/{order_id}/status", response_model=schemas.Order)
def update_status(
    order_id: int, 
    status_update: schemas.OrderUpdateStatus, 
    db: Session = Depends(database.get_db)
):
    db_order = crud.update_order_status(db, order_id=order_id, status=status_update.status)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return db_order
    
"""
    Função auxiliar para enviar o pedido para a fila de análise de IA no Redis.
"""
def notify_priority_service(order_id: int, description: str):
    payload = {"order_id": order_id, "description": description}
    redis_client.publish("order_priority_queue", json.dumps(payload))
    