from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from auth import router as auth_router
from database import get_connection

app = FastAPI()
app.include_router(auth_router)

security = HTTPBearer()

SECRET_KEY = "varixa-secret-key"
ALGORITHM = "HS256"

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def read_users(user=Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users;")
    users = cur.fetchall()
    conn.close()
    return {"users": users}

@app.get("/me")
def read_me(user=Depends(get_current_user)):
    return {"user": user}

@app.get("/admin-only")
def admin_only(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only.")
    return {"message": "Hoş geldin admin!"}
