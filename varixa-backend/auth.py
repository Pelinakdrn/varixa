from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "varixa-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Bellek içi kullanıcı verisi
users_db = {}

class RegisterUser(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "user"  # yeni: rol alanı eklendi

class LoginUser(BaseModel):
    email: str
    password: str

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register(user: RegisterUser):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = pwd_context.hash(user.password)
    users_db[user.email] = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed,
        "role": user.role
    }
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: LoginUser):
    stored_user = users_db.get(user.email)
    if not stored_user or not pwd_context.verify(user.password, stored_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": user.email, "role": stored_user["role"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Login olan kullanıcının bilgilerini token'dan çözen yardımcı fonksiyon
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
