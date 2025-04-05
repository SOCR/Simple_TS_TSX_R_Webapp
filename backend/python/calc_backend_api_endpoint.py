from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class CalculationRequest(BaseModel):
    num1: float
    num2: float
    operation: str

@app.get("/")
async def root():
    return {"message": "Calculator API is running"}

@app.post("/calculate")
async def calculate(request: CalculationRequest):
    num1 = request.num1
    num2 = request.num2
    operation = request.operation

    print(f"Received request: num1={num1}, num2={num2}, operation={operation}")
    
    result = None
    
    if operation == "add":
        result = num1 + num2
    elif operation == "subtract":
        result = num1 - num2
    elif operation == "multiply":
        result = num1 * num2
    elif operation == "divide":
        if num2 == 0:
            raise HTTPException(status_code=400, detail="Cannot divide by zero")
        result = num1 / num2
    else:
        raise HTTPException(status_code=400, detail="Invalid operation")
    
    return {
        "result": result,
        "operation": operation,
        "num1": num1,
        "num2": num2
    }

# To run this FastAPI app:
# uvicorn calc_backend_api_endpoint:app --reload
