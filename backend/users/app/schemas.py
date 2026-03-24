from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

# ==========================================
# SCHEMAS DE USUÁRIO
# ==========================================

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Nome de usuário único")
    full_name: Optional[str] = Field(None, max_length=100, description="Nome completo do usuário")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Senha em texto plano")

class UserResponse(UserBase):
    """Schema para retorno de dados do usuário (sem a senha)"""
    id: int
    
    # Configuração para que o Pydantic entenda modelos do SQLAlchemy
    model_config = ConfigDict(from_attributes=True)

# ==========================================
# SCHEMAS DE AUTENTICAÇÃO
# ==========================================

class LoginRequest(BaseModel):
    """Payload enviado pelo MFE Auth"""
    username: str
    password: str

class Token(BaseModel):
    """Resposta de sucesso após o login"""
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    """Estrutura do payload dentro do JWT"""
    username: Optional[str] = None