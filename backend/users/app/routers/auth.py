from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas, database, auth_utils

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    # Busca usuário
    user = db.query(models.User).filter(models.User.username == login_data.username).first()
    
    # Mock para o PMV: Se não existe usuário, cria o admin na hora
    if not user and login_data.username == "admin":
        user = models.User(
            username="admin", 
            password_hash=auth_utils.get_password_hash("admin123"),
            full_name="Administrador do Sistema"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user or not auth_utils.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos"
        )

    access_token = auth_utils.create_access_token(data={"sub": user.username})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user #O Pydantic converterá o objeto SQLAlchemy para o schema UserResponse
    }