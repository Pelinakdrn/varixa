from fastapi import FastAPI
from app.database import engine
from app.models import user
from app.routers import auth
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Varixa backend is alive 🚀"}

app.include_router(auth.router)

user.Base.metadata.create_all(bind=engine)
