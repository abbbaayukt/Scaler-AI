import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env file locally

from database import engine, Base
from routers import users, products, cart, orders, wishlist

# Create tables on startup (safe even if already exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Flipkart Clone API",
    description="A full-featured e-commerce REST API built with FastAPI + SQLAlchemy.",
    version="1.0.0"
)

# -------------------------------------------------------
# CORS — in production, replace "*" with your Vercel URL
# e.g. ["https://your-app.vercel.app"]
# -------------------------------------------------------
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=FRONTEND_URL != "*",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(wishlist.router)

@app.get("/")
def root():
    return {"message": "Flipkart Clone API is running 🚀"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
