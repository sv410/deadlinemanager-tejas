from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routers import auth, tasks

# Lifespan event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Initializing database...")
    init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("🛑 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="DeadlineSync API",
    description="Production-ready deadline management system with intelligent task prioritization",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/", tags=["Health"])
async def root():
    """API health check"""
    return {
        "message": "DeadlineSync API is running",
        "version": "1.0.0",
        "docs": "/api/docs",
        "database": "Connected"
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "deadline-manager-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
