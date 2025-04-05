# Python Calculator Backend

This is a simple calculator API built with FastAPI. It provides endpoints for performing basic arithmetic operations.

## Installation

### Method 1: Using Anaconda (Recommended)

Using Anaconda provides better dependency management and environment isolation.

1. **Install Anaconda or Miniconda**
   
   Download and install from [Anaconda's website](https://www.anaconda.com/products/distribution) or [Miniconda](https://docs.conda.io/en/latest/miniconda.html)

2. **Create a new conda environment**

   ```bash
   conda create -n calculator-api python=3.10
   ```

3. **Activate the environment**

   ```bash
   conda activate calculator-api
   ```

4. **Install required packages**

   ```bash
   pip install -r requirements.txt
   ```

### Method 2: Using pip directly

If you prefer not to use Anaconda, you can install dependencies directly with pip.

1. **Create a virtual environment** (optional but recommended)

   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment**

   On Windows:
   ```bash
   venv\Scripts\activate
   ```

   On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

3. **Install required packages**

   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Ensure your environment is activated** (either conda or venv)

2. **Start the FastAPI server**

   ```bash
   uvicorn calc_backend_api_endpoint:app --reload --port 8000
   ```

   This will start the server on http://localhost:8000

3. **Test the API**

   You can test the API directly by visiting:
   - http://localhost:8000/docs - Interactive API documentation
   - http://localhost:8000/calculate - The calculation endpoint (POST)

## API Endpoints

- `GET /` - Health check endpoint
- `POST /calculate` - Performs calculations
  - Parameters:
    - `num1`: First number
    - `num2`: Second number 
    - `operation`: One of "add", "subtract", "multiply", or "divide"

## Example Request

```json
{
  "num1": 10, 
  "num2": 5,
  "operation": "add"
}
```

## Example Response

```json
{
  "result": 15,
  "operation": "add",
  "num1": 10,
  "num2": 5
}
```
