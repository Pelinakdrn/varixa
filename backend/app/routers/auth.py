from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas

router = APIRouter(
    prefix="/auth",  # Swagger'da gruplama ve endpoint URL’si için
    tags=["Auth"]
)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.SessionLocal)):
    db_user = db.query(models.user.User).filter(models.user.User.email == user.email).first()

    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "email": db_user.email,
        "full_name": db_user.full_name
    }
