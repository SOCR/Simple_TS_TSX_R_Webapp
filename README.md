# Multi-Backend Demo: React + Python + R Integration

This project demonstrates how to build a React frontend application that communicates with multiple backend services written in Python and R. It includes three examples:

1. **Python Calculator**: A simple calculator using FastAPI (Python)
2. **R Statistics Calculator**: A statistics analyzer using Plumber API (R)
3. **OpenAI Chat**: A chat interface that connects to OpenAI's API

## Implementation Overview

### Frontend (React + TypeScript + Vite)

The frontend is built with React, TypeScript, and Vite, using Tailwind CSS for styling. It communicates with the backend services through HTTP requests.

### Python Backend (FastAPI)

The Python backend provides a simple calculator API with endpoints for basic arithmetic operations (addition, subtraction, multiplication, division).

### R Backend (Plumber)

The R backend provides a statistics API that calculates various metrics (mean, median, mode, etc.) for a list of numbers.

## Project Setup

### Prerequisites

#### Node.js and npm

You'll need Node.js (v14 or newer) and npm installed:

- **Windows/macOS**:
  1. Download the installer from [Node.js official website](https://nodejs.org/)
  2. Run the installer and follow the installation wizard
  3. Verify installation by running:
     ```bash
     node --version
     npm --version
     ```

- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- **Using NVM (Node Version Manager, recommended for developers)**:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  nvm install 16
  nvm use 16
  ```

#### Other Requirements

- Python 3.8+ for the Python backend
- R for the R backend
- OpenAI API key for the chat example
- Python 3.8+ for the Python backend
- R for the R backend
- OpenAI API key for the chat example

### Environment Variables

The project uses environment variables for configuration. An example file `.env.example` is provided.

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

## Running the Project

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The React application will start on http://localhost:5173

### Python Backend (For example 1)

#### Method 1: Using Anaconda (Recommended)

1. Create and activate a conda environment:
   ```bash
   conda create -n calculator-api python=3.10
   conda activate calculator-api
   ```

2. Install dependencies:
   ```bash
   cd backend/python
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn calc_backend_api_endpoint:app --reload --port 8000
   ```

#### Method 2: Using pip directly

1. Create and activate a virtual environment:
   ```bash
   cd backend/python
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn calc_backend_api_endpoint:app --reload --port 8000
   ```

### R Backend (For example 2)

#### Method 1: Using RStudio (Recommended)

1. Open RStudio and install required packages:
   ```r
   install.packages(c("plumber", "jsonlite"))
   ```

2. Open the `backend/R/stats_backend_api_endpoint.R` file in RStudio

3. Run the Plumber API server:
   ```r
   plumber::plumb("stats_backend_api_endpoint.R")$run(port=8080)
   ```

#### Method 2: Using R directly 

1. Install R from [CRAN](https://cran.r-project.org/)

2. Install required packages:
   ```r
   install.packages(c("plumber", "jsonlite"))
   ```

3. Start the Plumber API server:
   ```bash
   cd backend/R
   Rscript -e "library(plumber); pr <- plumb('stats_backend_api_endpoint.R'); pr$run(port=8080)"
   ```

## Example Applications

### 1. Python Calculator
![image](https://github.com/user-attachments/assets/61a79952-b9fd-4b95-ac32-648af869f06e)

- **Frontend Route**: `/python-calculator`    (i.e `http://localhost:5173/python-calculator`)
- **Description**: Performs basic arithmetic operations using a Python backend
- **Requirements**: Python backend must be running on port 8000
- **Usage**: Enter two numbers and select an operation to calculate the result

### 2. R Statistics Calculator

![image](https://github.com/user-attachments/assets/a48d8ad4-b796-4bdc-a8a5-a85a68bd9528)


- **Frontend Route**: `/r-stats` (i.e `http://localhost:5173/r-stats`)
- **Description**: Calculates statistics for a list of numbers using an R backend
- **Requirements**: R backend must be running on port 8080
- **Usage**: Enter a comma-separated list of numbers to calculate statistics

### 3. OpenAI Chat

![image](https://github.com/user-attachments/assets/79a10307-401b-441b-b7f6-d50473071d1d)

- **Frontend Route**: `/chat` (i.e `http://localhost:5173/chat`)
- **Description**: Simple chat interface using OpenAI's API
- **Requirements**: Valid OpenAI API key in the `.env` file
- **Usage**: Type messages to chat with the AI assistant

## Troubleshooting

- **Python Backend Issues**: Check that FastAPI is running on port 8000 and CORS is properly configured
- **R Backend Issues**: Ensure the Plumber API is running on port 8080 and can parse JSON requests
- **OpenAI API Issues**: Verify your API key is correctly set in the `.env` file

## Project Structure

```
├── frontend/ # React frontend application
| |.env.example # Example environment variables
│ ├── src/
│ │ ├── services/ # API clients for backend communication
│ │ └── pages/ # React components for each example
├── backend/
│ ├── python/ # Python FastAPI calculator backend
│ └── R/ # R Plumber statistics backend
└── README.md # Project documentation
```

## References
 - [SOCR](https://socr.umich.edu) and [SOCR HTML5 Webapps](https://socr.umich.edu/HTML5/)
 - [GrayRain](https://gray-rain.com)

