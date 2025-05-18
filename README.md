# Disclosure Risk Estimator

This project is a web application for estimating disclosure risk in datasets. It consists of a React frontend and an R Plumber API backend.

## Project Structure

```
.
├── backend/
│   └── R/
│       ├── DRE.R           # Core DRG functionality
│       └── DRE_api.R       # R Plumber API endpoints
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API service
    │   └── types/         # TypeScript type definitions
    ├── package.json
    └── tsconfig.json
```

## Setup

### Backend (R Plumber API)

1. Install required R packages:
```R
install.packages(c("plumber", "jsonlite", "cluster", "stringr", "writexl", "ggplot2", "plotly"))
```

2. Start the R Plumber API:
```R
library(plumber)
pr <- plumber::plumb("backend/R/DRE_api.R")
pr$run(port=8000)
```

### Frontend (React)

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Upload your original dataset (CSV file)
3. Upload one or more obfuscated datasets (CSV files)
4. Configure the parameters:
   - Number of replications
   - Target selection method (random or specified)
   - Feature selection method (random or specified)
   - Complexity values (if using random features)
   - Feature names (if using specified features)
   - Radius values
5. Click "Calculate" to run the analysis
6. View the results in the plots and tables

## API Endpoints

- `POST /calculate`: Calculate DRG scores
- `GET /features`: Get available features from original dataset
- `POST /plots`: Generate plots from scores data
- `POST /distance-plot`: Generate distance plot

## Development

### Backend

The backend is built using R Plumber and provides RESTful API endpoints for the core DRG functionality. The main components are:

- `DRE.R`: Contains the core DRG algorithm implementation
- `DRE_api.R`: Defines the API endpoints and request/response handling

### Frontend

The frontend is built using React and TypeScript, with Material-UI for the user interface. The main components are:

- `DRECalculator.tsx`: Main component for the calculator interface
- `api.ts`: Service for communicating with the backend API

## License

This project is licensed under the MIT License - see the LICENSE file for details.

