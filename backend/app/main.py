from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import characters

app = FastAPI(
    title="D&D Character Builder",
    description="A D&D 5e Character Builder API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(characters.router)

@app.get("/")
async def root():
    return {"message": "Welcome to D&D Character Builder API"} 