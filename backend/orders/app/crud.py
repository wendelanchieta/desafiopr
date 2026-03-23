from sqlalchemy.orm import Session
from . import models, schemas

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(models.Order)
    if status:
        query = query.filter(models.Order.status == status)
    return query.offset(skip).limit(limit).all()

def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(
        nome=order.nome,
        descricao_item=order.descricao_item,
        quantidade=order.quantidade,
        status="Pendente"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_status(db: Session, order_id: int, status: str):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order